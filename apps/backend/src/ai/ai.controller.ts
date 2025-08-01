import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';

export class SolveProblemDto {
  problemText: string;
  subject: string;
  imageUrl?: string;
}

export class GenerateQuizDto {
  concepts: string[];
  difficulty: string;
  count: number;
}

export class GradeSolutionDto {
  studentAnswer: string;
  correctSolution: string;
  rubric: any;
}

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('solve')
  @ApiOperation({ summary: 'Solve a mathematical or scientific problem' })
  @ApiResponse({ status: 200, description: 'Problem solved successfully' })
  async solveProblem(@Body() dto: SolveProblemDto) {
    return this.aiService.solveProblem(dto.problemText, dto.subject);
  }

  @Post('quiz/generate')
  @ApiOperation({ summary: 'Generate quiz questions based on concepts' })
  @ApiResponse({ status: 200, description: 'Quiz generated successfully' })
  async generateQuiz(@Body() dto: GenerateQuizDto) {
    return this.aiService.generateQuiz(dto.concepts, dto.difficulty, dto.count);
  }

  @Post('rubric/generate')
  @ApiOperation({ summary: 'Generate grading rubric for assignment' })
  @ApiResponse({ status: 200, description: 'Rubric generated successfully' })
  async generateRubric(@Body() dto: { assignmentDescription: string; subject: string }) {
    return this.aiService.generateRubric(dto.assignmentDescription, dto.subject);
  }

  @Post('grade')
  @ApiOperation({ summary: 'Grade student solution using rubric' })
  @ApiResponse({ status: 200, description: 'Solution graded successfully' })
  async gradeSolution(@Body() dto: GradeSolutionDto) {
    return this.aiService.gradeSolution(dto.studentAnswer, dto.correctSolution, dto.rubric);
  }
}
