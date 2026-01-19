import { apiService } from './api';
import { HeroContent } from '@/types/content';

interface RawHeroResponse {
  tagline: string;
  headline: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  backgroundImageUrl: string;
}

class PublicHeroApi {
  /**
   * Get Hero content for public display
   * This endpoint is accessible without authentication
   */
  async getHero(): Promise<HeroContent> {
    try {
      const response = await apiService.get<RawHeroResponse>('/hero');
      
      return {
        tagline: response.tagline || '',
        headline: response.headline || '',
        subtitle: response.subtitle || '',
        primaryButtonText: response.primaryButtonText || '',
        secondaryButtonText: response.secondaryButtonText || '',
        backgroundImageUrl: response.backgroundImageUrl || '',
      };
    } catch (error) {
      console.error('Failed to fetch Hero:', error);
      return {
        tagline: '',
        headline: '',
        subtitle: '',
        primaryButtonText: '',
        secondaryButtonText: '',
        backgroundImageUrl: '',
      };
    }
  }
}

export const publicHeroApi = new PublicHeroApi();
