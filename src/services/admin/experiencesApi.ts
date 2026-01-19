import { apiService } from '../api';
import { Experience } from '@/types/content';

export interface ExperienceResponse {
  _id: string;
  title: string;
  description: string;
  order: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

class ExperiencesApi {
  async getAllExperiences(): Promise<Experience[]> {
    const response = await apiService.get<ExperienceResponse[]>('/admin/experiences');
    return response.map(this.transformExperienceResponse);
  }

  async updateExperiences(experiences: Experience[]): Promise<Experience[]> {
    const response = await apiService.put<ExperienceResponse[]>('/admin/experiences', { experiences });
    return response.map(this.transformExperienceResponse);
  }

  async createExperience(experience: Omit<Experience, 'id'>): Promise<Experience> {
    const response = await apiService.post<ExperienceResponse>('/admin/experiences', experience);
    return this.transformExperienceResponse(response);
  }

  async updateExperience(id: string, experience: Partial<Experience>): Promise<Experience> {
    const response = await apiService.put<ExperienceResponse>(`/admin/experiences/${id}`, experience);
    return this.transformExperienceResponse(response);
  }

  async deleteExperience(id: string): Promise<void> {
    await apiService.delete(`/admin/experiences/${id}`);
  }

  private transformExperienceResponse(response: ExperienceResponse): Experience {
    return {
      id: response._id,
      title: response.title,
      description: response.description,
    };
  }
}

export const experiencesApi = new ExperiencesApi();
