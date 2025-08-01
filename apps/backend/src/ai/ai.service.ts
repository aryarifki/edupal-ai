import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import axios from 'axios';

export interface AiResponse {
  solution: string;
  stepByStep: any[];
  concepts: string[];
  errors: any[];
  confidence: number;
}

export interface KimiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

@Injectable()
export class AiService {
  private openai: OpenAI;
  private kimiApiKey: string;
  private kimiApiBase: string;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.kimiApiKey = this.configService.get<string>('KIMI_API_KEY');
    this.kimiApiBase = this.configService.get<string>('KIMI_API_BASE') || 'https://api.moonshot.cn/v1';
  }

  async solveProblem(problemText: string, subject: string): Promise<AiResponse> {
    try {
      // Use Kimi K2 for problem solving
      const kimiResponse = await this.callKimiApi(problemText, subject);
      
      // Parse the response and extract solution components
      const solution = this.parseKimiResponse(kimiResponse);
      
      // Use OpenAI for additional analysis and concept extraction
      const analysisResponse = await this.analyzeWithOpenAI(problemText, solution.solution, subject);
      
      return {
        solution: solution.solution,
        stepByStep: solution.stepByStep,
        concepts: analysisResponse.concepts,
        errors: solution.errors,
        confidence: solution.confidence,
      };
    } catch (error) {
      throw new HttpException(
        `AI processing failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateQuiz(concepts: string[], difficulty: string, count: number = 5): Promise<any[]> {
    try {
      const prompt = this.createQuizPrompt(concepts, difficulty, count);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const quizData = JSON.parse(response.choices[0].message.content);
      return quizData.questions;
    } catch (error) {
      throw new HttpException(
        `Quiz generation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateRubric(assignmentDescription: string, subject: string): Promise<any> {
    try {
      const prompt = this.createRubricPrompt(assignmentDescription, subject);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      throw new HttpException(
        `Rubric generation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async gradeSolution(studentAnswer: string, correctSolution: string, rubric: any): Promise<any> {
    try {
      const prompt = this.createGradingPrompt(studentAnswer, correctSolution, rubric);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1000,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      throw new HttpException(
        `Grading failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async callKimiApi(problemText: string, subject: string): Promise<KimiResponse> {
    const prompt = this.createKimiPrompt(problemText, subject);
    
    try {
      const response = await axios.post(
        `${this.kimiApiBase}/chat/completions`,
        {
          model: 'moonshot-v1-8k',
          messages: [
            {
              role: 'system',
              content: 'You are an expert mathematics and science tutor. Provide detailed step-by-step solutions.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.kimiApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Kimi API Error:', error.response?.data || error.message);
      throw new Error(`Kimi API request failed: ${error.message}`);
    }
  }

  private parseKimiResponse(response: KimiResponse): any {
    try {
      const content = response.choices[0].message.content;
      
      // Parse the structured response from Kimi
      const solutionMatch = content.match(/SOLUTION:(.*?)(?=STEPS:|$)/s);
      const stepsMatch = content.match(/STEPS:(.*?)(?=CONCEPTS:|$)/s);
      const conceptsMatch = content.match(/CONCEPTS:(.*?)(?=ERRORS:|$)/s);
      const errorsMatch = content.match(/ERRORS:(.*?)$/s);

      return {
        solution: solutionMatch ? solutionMatch[1].trim() : content,
        stepByStep: stepsMatch ? this.parseSteps(stepsMatch[1].trim()) : [],
        concepts: conceptsMatch ? conceptsMatch[1].split(',').map(c => c.trim()) : [],
        errors: errorsMatch ? this.parseErrors(errorsMatch[1].trim()) : [],
        confidence: 0.9, // Default confidence score
      };
    } catch (error) {
      return {
        solution: response.choices[0].message.content,
        stepByStep: [],
        concepts: [],
        errors: [],
        confidence: 0.7,
      };
    }
  }

  private async analyzeWithOpenAI(problemText: string, solution: string, subject: string): Promise<any> {
    const prompt = `
      Analyze the following problem and solution for the subject ${subject}:
      
      Problem: ${problemText}
      Solution: ${solution}
      
      Please identify:
      1. Key mathematical/scientific concepts involved
      2. Difficulty level (1-5)
      3. Common mistakes students might make
      4. Related topics for further study
      
      Return your response as JSON with fields: concepts, difficulty, commonMistakes, relatedTopics
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch {
      return {
        concepts: [subject],
        difficulty: 3,
        commonMistakes: [],
        relatedTopics: [],
      };
    }
  }

  private createKimiPrompt(problemText: string, subject: string): string {
    return `
      Please solve this ${subject} problem step by step:
      
      ${problemText}
      
      Format your response as follows:
      SOLUTION: [Final answer]
      STEPS: [Numbered list of solution steps]
      CONCEPTS: [Comma-separated list of key concepts]
      ERRORS: [Common mistakes to avoid]
      
      Make sure to explain each step clearly and highlight important concepts.
    `;
  }

  private createQuizPrompt(concepts: string[], difficulty: string, count: number): string {
    return `
      Generate ${count} ${difficulty} difficulty quiz questions covering these concepts: ${concepts.join(', ')}.
      
      Return a JSON object with this structure:
      {
        "questions": [
          {
            "id": 1,
            "question": "Question text",
            "options": ["A", "B", "C", "D"],
            "correct": 0,
            "explanation": "Why this answer is correct",
            "concepts": ["concept1", "concept2"]
          }
        ]
      }
    `;
  }

  private createRubricPrompt(assignmentDescription: string, subject: string): string {
    return `
      Create a detailed grading rubric for this ${subject} assignment:
      
      ${assignmentDescription}
      
      Return a JSON object with this structure:
      {
        "criteria": [
          {
            "name": "Criterion name",
            "weight": 0.3,
            "levels": [
              {"score": 4, "description": "Excellent"},
              {"score": 3, "description": "Good"},
              {"score": 2, "description": "Satisfactory"},
              {"score": 1, "description": "Needs improvement"}
            ]
          }
        ],
        "totalPoints": 100
      }
    `;
  }

  private createGradingPrompt(studentAnswer: string, correctSolution: string, rubric: any): string {
    return `
      Grade this student's answer using the provided rubric:
      
      Student Answer: ${studentAnswer}
      Correct Solution: ${correctSolution}
      Rubric: ${JSON.stringify(rubric)}
      
      Return a JSON object with:
      {
        "score": 85,
        "maxScore": 100,
        "feedback": "Detailed feedback",
        "criteriaScores": [
          {"criterion": "name", "score": 4, "feedback": "specific feedback"}
        ]
      }
    `;
  }

  private parseSteps(stepsText: string): any[] {
    const lines = stepsText.split('\n').filter(line => line.trim());
    return lines.map((line, index) => ({
      step: index + 1,
      description: line.replace(/^\d+\.?\s*/, '').trim(),
      explanation: '',
    }));
  }

  private parseErrors(errorsText: string): any[] {
    const lines = errorsText.split('\n').filter(line => line.trim());
    return lines.map(line => ({
      type: 'common_mistake',
      description: line.trim(),
      suggestion: 'Review the concept and practice similar problems',
    }));
  }
}
