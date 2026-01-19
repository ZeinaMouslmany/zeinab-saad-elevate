import { apiService } from './api';
import { Experience } from '@/types/content';

interface RawExperience {
  _id: string;
  title: string;
  description: string;
  order?: number;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class PublicExperiencesApi {
  /**
   * Get all enabled experiences for public display
   * This endpoint is accessible without authentication
   */
  async getExperiences(): Promise<Experience[]> {
    try {
      const response = await apiService.get<RawExperience[]>('/experiences');
      
      // Ensure response is an array
      if (!Array.isArray(response)) {
        console.warn('Experiences API returned non-array response:', response);
        return [];
      }
      
      return response.map(this.transformExperienceResponse);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      throw new Error('Unable to load experiences. Please try again later.');
    }
  }

  /**
   * Transform backend response to frontend Experience type
   */
  private transformExperienceResponse(response: RawExperience): Experience {
    return {
      id: response._id,
      title: response.title,
      description: response.description,
    };
  }
}

export const publicExperiencesApi = new PublicExperiencesApi();
