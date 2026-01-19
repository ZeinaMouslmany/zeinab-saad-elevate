import { apiService } from './api';
import { CTAContent } from '@/types/content';

interface RawCTAResponse {
  headline: string;
  subtitle: string;
  buttonText: string;
}

class PublicCTAApi {
  /**
   * Get CTA content for public display
   * This endpoint is accessible without authentication
   */
  async getCTA(): Promise<CTAContent> {
    try {
      const response = await apiService.get<RawCTAResponse>('/cta');
      
      return {
        headline: response.headline || '',
        subtitle: response.subtitle || '',
        buttonText: response.buttonText || '',
      };
    } catch (error) {
      console.error('Failed to fetch CTA:', error);
      return {
        headline: '',
        subtitle: '',
        buttonText: '',
      };
    }
  }
}

export const publicCTAApi = new PublicCTAApi();
