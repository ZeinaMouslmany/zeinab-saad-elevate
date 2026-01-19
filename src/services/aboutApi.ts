import { apiService } from './api';
import { AboutContent } from '@/types/content';

interface RawAboutResponse {
  name: string;
  tagline: string;
  bio: string[];
  stats: {
    clientsTrained: string;
    yearsExperience: string;
    workshops: string;
  };
  profileImageUrl: string;
  statsEnabled?: boolean;
}

class PublicAboutApi {
  /**
   * Get About content for public display
   * This endpoint is accessible without authentication
   */
  async getAbout(): Promise<AboutContent> {
    try {
      const response = await apiService.get<RawAboutResponse>('/about');
      
      return {
        name: response.name || '',
        tagline: response.tagline || '',
        bio: Array.isArray(response.bio) ? response.bio : [],
        stats: {
          clientsTrained: response.stats?.clientsTrained || '',
          yearsExperience: response.stats?.yearsExperience || '',
          workshops: response.stats?.workshops || '',
        },
        profileImageUrl: response.profileImageUrl || '',
        statsEnabled: typeof response.statsEnabled === 'boolean' ? response.statsEnabled : true,
      };
    } catch (error) {
      console.error('Failed to fetch About:', error);
      return {
        name: '',
        tagline: '',
        bio: [],
        stats: {
          clientsTrained: '',
          yearsExperience: '',
          workshops: '',
        },
        profileImageUrl: '',
        statsEnabled: true,
      };
    }
  }
}

export const publicAboutApi = new PublicAboutApi();
