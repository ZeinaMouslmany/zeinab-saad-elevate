import { apiService } from '../api';
import { CTAContent } from '@/types/content';

interface RawCTAResponse {
  _id: string;
  headline: string;
  subtitle: string;
  buttonText: string;
  createdAt: string;
  updatedAt: string;
}

class CTAApi {
  async getCTA(): Promise<CTAContent> {
    const response = await apiService.get<RawCTAResponse>('/admin/cta');
    
    return {
      headline: response.headline || '',
      subtitle: response.subtitle || '',
      buttonText: response.buttonText || '',
    };
  }

  async updateCTA(data: CTAContent): Promise<CTAContent> {
    const response = await apiService.put<RawCTAResponse>('/admin/cta', {
      headline: data.headline,
      subtitle: data.subtitle,
      buttonText: data.buttonText,
    });

    return {
      headline: response.headline || '',
      subtitle: response.subtitle || '',
      buttonText: response.buttonText || '',
    };
  }
}

export const ctaApi = new CTAApi();
