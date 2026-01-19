import { apiService, API_BASE_URL } from '../api';
import { AboutContent } from '@/types/content';

interface RawAboutResponse {
  _id: string;
  name: string;
  tagline: string;
  bio: string[];
  stats: {
    clientsTrained: string;
    yearsExperience: string;
    workshops: string;
  };
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
  statsEnabled?: boolean;
}

interface UploadResponse {
  url: string;
  public_id: string;
}

class AboutEditorApi {
  async getAbout(): Promise<AboutContent> {
    const response = await apiService.get<RawAboutResponse>('/admin/about');
    
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
  }

  async updateAbout(data: AboutContent): Promise<AboutContent> {
    const response = await apiService.put<RawAboutResponse>('/admin/about', {
      name: data.name,
      tagline: data.tagline,
      bio: data.bio,
      stats: {
        clientsTrained: data.stats.clientsTrained,
        yearsExperience: data.stats.yearsExperience,
        workshops: data.stats.workshops,
      },
      profileImageUrl: data.profileImageUrl,
      statsEnabled: data.statsEnabled,
    });

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
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const token = sessionStorage.getItem('zeinab-admin-token');
    
    const uploadBase = (API_BASE_URL || '').replace(/\/$/, '');
    const response = await fetch(`${uploadBase}/upload/image`, {
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

export const aboutEditorApi = new AboutEditorApi();
