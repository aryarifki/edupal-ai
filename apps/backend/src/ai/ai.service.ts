import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import axios from 'axios';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private openaiApiKey: string;
  private kimiApiKey: string;
  private kimiApiBase: string;

  constructor(private configService: ConfigService) {
    // Initialize API keys
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.kimiApiKey = this.configService.get<string>('KIMI_API_KEY');
    this.kimiApiBase = this.configService.get<string>('KIMI_API_BASE') || 'https://api.moonshot.cn/v1';
    
    // Initialize OpenAI client
    if (this.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: this.openaiApiKey,
      });
    }
    
    // Validate configuration
    this.validateConfiguration();
  }

  private validateConfiguration() {
    const requiredKeys = [
      'OPENAI_API_KEY',
      'KIMI_API_KEY',
      'KIMI_API_BASE'
    ];

    const missing = requiredKeys.filter(key => !this.configService.get(key));
    
    if (missing.length > 0) {
      console.warn(`Missing environment variables: ${missing.join(', ')}`);
    }
  }

  async solveProblem(problemText: string, subject: string): Promise<any> {
    try {
      // Input validation
      if (!problemText?.trim()) {
        throw new HttpException('Problem text is required', HttpStatus.BAD_REQUEST);
      }

      // Check API keys
      if (!this.openaiApiKey && !this.kimiApiKey) {
        throw new HttpException('AI API keys not configured', HttpStatus.SERVICE_UNAVAILABLE);
      }

      // Try Kimi API first, fallback to OpenAI
      let solution;
      try {
        if (this.kimiApiKey) {
          solution = await this.callKimiApi(problemText, subject);
        } else {
          solution = await this.callOpenAIApi(problemText, subject);
        }
      } catch (apiError) {
        console.warn('Primary AI API failed, trying fallback:', apiError.message);
        // Fallback to other API
        if (this.kimiApiKey && apiError.message.includes('OpenAI')) {
          solution = await this.callKimiApi(problemText, subject);
        } else if (this.openaiApiKey) {
          solution = await this.callOpenAIApi(problemText, subject);
        } else {
          throw apiError;
        }
      }

      const analysisResponse = await this.analyzeProblem(problemText, subject);
      
      return {
        solution: solution.solution,
        stepByStep: solution.stepByStep || [],
        concepts: analysisResponse.concepts || [],
        errors: solution.errors || [],
        confidence: solution.confidence || 0.8,
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        `AI processing failed: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async callKimiApi(problemText: string, subject: string): Promise<any> {
    try {
      const prompt = this.buildProblemSolvingPrompt(problemText, subject);
      
      const response = await axios.post(
        `${this.kimiApiBase}/chat/completions`,
        {
          model: 'moonshot-v1-8k',
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI tutor that provides detailed step-by-step solutions to academic problems. Always provide solutions in JSON format with solution, stepByStep array, and confidence score.'
            },
            {
              role: 'user',
              content: prompt
            }
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

      return this.parseAIResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Kimi API Error:', error.response?.data || error.message);
      throw new Error(`Kimi API failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  private async callOpenAIApi(problemText: string, subject: string): Promise<any> {
    try {
      const prompt = this.buildProblemSolvingPrompt(problemText, subject);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI tutor that provides detailed step-by-step solutions to academic problems. Always provide solutions in JSON format with solution, stepByStep array, and confidence score.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      return this.parseAIResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API failed: ${error.message}`);
    }
  }

  private buildProblemSolvingPrompt(problemText: string, subject: string): string {
    return `
Please solve this ${subject} problem step by step and provide a detailed explanation:

Problem: ${problemText}

Provide your response in the following JSON format:
{
  "solution": "Final answer or result",
  "stepByStep": [
    {
      "step": 1,
      "description": "First step description",
      "explanation": "Why this step is needed"
    }
  ],
  "confidence": 0.95,
  "errors": []
}

Make sure to:
1. Show all mathematical work clearly
2. Explain the reasoning for each step
3. Provide the final answer
4. Include relevant formulas or concepts used
`;
  }

  private parseAIResponse(content: string): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: create structured response from text
      return {
        solution: content,
        stepByStep: [
          {
            step: 1,
            description: content,
            explanation: 'AI provided solution'
          }
        ],
        confidence: 0.7,
        errors: []
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        solution: content,
        stepByStep: [],
        confidence: 0.5,
        errors: ['Failed to parse structured response']
      };
    }
  }

  private async analyzeProblem(problemText: string, subject: string): Promise<any> {
    // Simple concept extraction based on keywords
    const concepts = [];
    const text = problemText.toLowerCase();
    
    // Math concepts
    if (text.includes('quadratic') || text.includes('x²')) concepts.push('Quadratic Equations');
    if (text.includes('derivative') || text.includes('dx')) concepts.push('Calculus');
    if (text.includes('integral')) concepts.push('Integration');
    if (text.includes('velocity') || text.includes('acceleration')) concepts.push('Kinematics');
    if (text.includes('force') || text.includes('newton')) concepts.push('Dynamics');
    if (text.includes('energy') || text.includes('joule')) concepts.push('Energy');
    
    // Default concepts by subject
    if (concepts.length === 0) {
      switch (subject?.toLowerCase()) {
        case 'mathematics':
        case 'math':
          concepts.push('Mathematical Problem Solving');
          break;
        case 'physics':
          concepts.push('Physics Principles');
          break;
        case 'chemistry':
          concepts.push('Chemical Reactions');
          break;
        default:
          concepts.push('Problem Solving');
      }
    }
    
    return { concepts };
  }

  // Additional methods required by controller
  async generateQuiz(concepts: string[], difficulty: string, count: number): Promise<any> {
    try {
      const prompt = `Generate ${count} ${difficulty} level quiz questions covering these concepts: ${concepts.join(', ')}. Provide response in JSON format with questions array.`;
      
      if (this.kimiApiKey) {
        return await this.callKimiApi(prompt, 'quiz generation');
      } else if (this.openaiApiKey) {
        return await this.callOpenAIApi(prompt, 'quiz generation');
      } else {
        throw new HttpException('No AI APIs configured', HttpStatus.SERVICE_UNAVAILABLE);
      }
    } catch (error) {
      throw new HttpException(`Quiz generation failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async generateRubric(assignmentDescription: string, subject: string): Promise<any> {
    try {
      const prompt = `Generate a grading rubric for this ${subject} assignment: ${assignmentDescription}. Provide response in JSON format with criteria and scoring.`;
      
      if (this.kimiApiKey) {
        return await this.callKimiApi(prompt, 'rubric generation');
      } else if (this.openaiApiKey) {
        return await this.callOpenAIApi(prompt, 'rubric generation');
      } else {
        throw new HttpException('No AI APIs configured', HttpStatus.SERVICE_UNAVAILABLE);
      }
    } catch (error) {
      throw new HttpException(`Rubric generation failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async gradeSolution(studentAnswer: string, correctSolution: string, rubric: any): Promise<any> {
    try {
      const prompt = `Grade this student answer against the correct solution using the provided rubric:
Student Answer: ${studentAnswer}
Correct Solution: ${correctSolution}
Rubric: ${JSON.stringify(rubric)}
Provide response in JSON format with score and feedback.`;
      
      if (this.kimiApiKey) {
        return await this.callKimiApi(prompt, 'grading');
      } else if (this.openaiApiKey) {
        return await this.callOpenAIApi(prompt, 'grading');
      } else {
        throw new HttpException('No AI APIs configured', HttpStatus.SERVICE_UNAVAILABLE);
      }
    } catch (error) {
      throw new HttpException(`Grading failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
