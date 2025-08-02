async solveProblem(problemText: string, subject: string): Promise<any> {
  try {
    // Validasi input
    if (!problemText?.trim()) {
      throw new HttpException('Problem text is required', HttpStatus.BAD_REQUEST);
    }

    // Cek API keys
    if (!this.openaiApiKey || !this.kimiApiKey) {
      throw new HttpException('AI API keys not configured', HttpStatus.SERVICE_UNAVAILABLE);
    }

    const kimiResponse = await this.callKimiApi(problemText, subject);
    const analysisResponse = await this.analyzeProblem(problemText, subject);
    
    // Parse response dengan error handling
    const solution = this.parseKimiResponse(kimiResponse);
    
    return {
      solution: solution.solution,
      stepByStep: solution.stepByStep || [],
      concepts: analysisResponse.concepts || [],
      errors: solution.errors || [],
      confidence: solution.confidence || 0.5,
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
@Injectable()
export class AiService {
  constructor(private configService: ConfigService) {
    // Validasi API keys saat service di-inisialisasi
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
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
  }
