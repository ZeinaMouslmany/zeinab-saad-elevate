import { apiService } from './api';
import { Service } from '@/types/content';

export interface PublicServiceResponse {
  _id: string;
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  enabled: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

class PublicServicesApi {
  /**
   * Get all enabled services for public display
   * This endpoint is accessible without authentication
   */
  async getServices(): Promise<Service[]> {
    try {
      const response = await apiService.get<PublicServiceResponse[]>('/services');
      return response.map(this.transformServiceResponse);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      throw new Error('Unable to load services. Please try again later.');
    }
  }

  /**
   * Transform backend response to frontend Service type
   */
  private transformServiceResponse(response: PublicServiceResponse): Service {
    return {
      id: response.id,
      icon: response.icon,
      title: response.title,
      description: response.description,
      features: response.features,
      enabled: response.enabled,
    };
  }
}

export const publicServicesApi = new PublicServicesApi();
