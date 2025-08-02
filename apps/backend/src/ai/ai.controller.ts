import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { AiService } from './ai.service';

export class SolveProblemDto {
  @IsString()
  @IsNotEmpty()
  problemText: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class GenerateQuizDto {
  @IsArray()
  @IsString({ each: true })
  concepts: string[];

  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsNumber()
  @Min(1)
  @Max(20)
  count: number;
}

export class GradeSolutionDto {
  @IsString()
  @IsNotEmpty()
  studentAnswer: string;

  @IsString()
  @IsNotEmpty()
  correctSolution: string;

  @IsNotEmpty()
  rubric: any;
}

export class GenerateRubricDto {
  @IsString()
  @IsNotEmpty()
  assignmentDescription: string;

  @IsString()
  @IsNotEmpty()
  subject: string;
}

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('solve')
  @ApiOperation({ summary: 'Solve a mathematical or scientific problem' })
  @ApiResponse({ status: 200, description: 'Problem solved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input parameters' })
  @ApiResponse({ status: 503, description: 'AI services unavailable' })
  async solveProblem(@Body() dto: SolveProblemDto) {
    return this.aiService.solveProblem(dto.problemText, dto.subject);
  }

  @Post('quiz/generate')
  @ApiOperation({ summary: 'Generate quiz questions based on concepts' })
  @ApiResponse({ status: 200, description: 'Quiz generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input parameters' })
  async generateQuiz(@Body() dto: GenerateQuizDto) {
    return this.aiService.generateQuiz(dto.concepts, dto.difficulty, dto.count);
  }

  @Post('rubric/generate')
  @ApiOperation({ summary: 'Generate grading rubric for assignment' })
  @ApiResponse({ status: 200, description: 'Rubric generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input parameters' })
  async generateRubric(@Body() dto: GenerateRubricDto) {
    return this.aiService.generateRubric(dto.assignmentDescription, dto.subject);
  }

  @Post('grade')
  @ApiOperation({ summary: 'Grade student solution using rubric' })
  @ApiResponse({ status: 200, description: 'Solution graded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input parameters' })
  async gradeSolution(@Body() dto: GradeSolutionDto) {
    return this.aiService.gradeSolution(dto.studentAnswer, dto.correctSolution, dto.rubric);
  }
}
