import { apiService } from '../api';
import { Service } from '@/types/content';

export interface ServiceResponse {
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

class ServicesApi {
  async getServices(): Promise<Service[]> {
    const response = await apiService.get<ServiceResponse[]>('/services');
    return response.map(this.transformServiceResponse);
  }

  async getAllServices(): Promise<Service[]> {
    const response = await apiService.get<ServiceResponse[]>('/admin/services');
    return response.map(this.transformServiceResponse);
  }

  async updateServices(services: Service[]): Promise<Service[]> {
    const response = await apiService.put<ServiceResponse[]>('/admin/services', { services });
    return response.map(this.transformServiceResponse);
  }

  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    const response = await apiService.post<ServiceResponse>('/admin/services', service);
    return this.transformServiceResponse(response);
  }

  async updateService(id: string, service: Partial<Service>): Promise<Service> {
    const response = await apiService.put<ServiceResponse>(`/admin/services/${id}`, service);
    return this.transformServiceResponse(response);
  }

  async deleteService(id: string): Promise<void> {
    await apiService.delete(`/admin/services/${id}`);
  }

  private transformServiceResponse(response: ServiceResponse): Service {
    // Use custom id field if available, otherwise use _id as fallback
    // Convert _id to string if it's an ObjectId
    const id = response.id || String(response._id);
    return {
      id,
      icon: response.icon,
      title: response.title,
      description: response.description,
      features: response.features,
      enabled: response.enabled,
    };
  }
}

export const servicesApi = new ServicesApi();
