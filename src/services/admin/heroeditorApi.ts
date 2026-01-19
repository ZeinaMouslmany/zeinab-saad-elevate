import { apiService } from '../api';
import { HeroContent } from '@/types/content';

interface RawHeroResponse {
  _id: string;
  tagline: string;
  headline: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  backgroundImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface UploadResponse {
  url: string;
  public_id: string;
}

class HeroEditorApi {
  async getHero(): Promise<HeroContent> {
    const response = await apiService.get<RawHeroResponse>('/admin/hero');
    
    return {
      tagline: response.tagline || '',
      headline: response.headline || '',
      subtitle: response.subtitle || '',
      primaryButtonText: response.primaryButtonText || '',
      secondaryButtonText: response.secondaryButtonText || '',
      backgroundImageUrl: response.backgroundImageUrl || '',
    };
  }

  async updateHero(data: HeroContent): Promise<HeroContent> {
    const response = await apiService.put<RawHeroResponse>('/admin/hero', {
      tagline: data.tagline,
      headline: data.headline,
      subtitle: data.subtitle,
      primaryButtonText: data.primaryButtonText,
      secondaryButtonText: data.secondaryButtonText,
      backgroundImageUrl: data.backgroundImageUrl,
    });

    return {
      tagline: response.tagline || '',
      headline: response.headline || '',
      subtitle: response.subtitle || '',
      primaryButtonText: response.primaryButtonText || '',
      secondaryButtonText: response.secondaryButtonText || '',
      backgroundImageUrl: response.backgroundImageUrl || '',
    };
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const token = sessionStorage.getItem('zeinab-admin-token');
    
    const response = await fetch('http://localhost:5000/api/upload/image', {
      method: 'POST',
      headers: token ? {
        'Authorization': `Bearer ${token}`,
      } : {},
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Upload failed');
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data: UploadResponse = await response.json();
    return data.url;
  }
}

export const heroEditorApi = new HeroEditorApi();
