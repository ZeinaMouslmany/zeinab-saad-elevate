import { apiService, API_BASE_URL } from '../api';
import { Video } from '@/types/content';

interface RawVideoResponse {
  _id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface UploadResponse {
  url: string;
  public_id: string;
  thumbnail?: string;
}

class VideoEditorApi {
  async getVideos(): Promise<Video[]> {
    const response = await apiService.get<RawVideoResponse[]>('/admin/videos');
    
    return response.map(video => ({
      id: video._id || '',
      title: video.title || '',
      thumbnail: video.thumbnail || '',
      videoUrl: video.videoUrl || '',
      duration: video.duration || '0:00',
    }));
  }

  async createVideo(data: Omit<Video, 'id'> & { order?: number }): Promise<Video> {
    const response = await apiService.post<RawVideoResponse>('/admin/videos', {
      title: data.title,
      thumbnail: data.thumbnail,
      videoUrl: data.videoUrl,
      duration: data.duration,
      order: data.order,
    });

    return {
      id: response._id || '',
      title: response.title || '',
      thumbnail: response.thumbnail || '',
      videoUrl: response.videoUrl || '',
      duration: response.duration || '0:00',
    };
  }

  async updateVideo(id: string, data: Partial<Video> & { order?: number }): Promise<Video> {
    const response = await apiService.put<RawVideoResponse>(`/admin/videos/${id}`, {
      title: data.title,
      thumbnail: data.thumbnail,
      videoUrl: data.videoUrl,
      duration: data.duration,
      order: data.order,
    });

    return {
      id: response._id || '',
      title: response.title || '',
      thumbnail: response.thumbnail || '',
      videoUrl: response.videoUrl || '',
      duration: response.duration || '0:00',
    };
  }

  async deleteVideo(id: string): Promise<void> {
    await apiService.delete(`/admin/videos/${id}`);
  }

  async updateVideoOrder(videos: { id: string; order: number }[]): Promise<Video[]> {
    const response = await apiService.put<RawVideoResponse[]>('/admin/videos/order', {
      videos: videos.map(v => ({ id: v.id, order: v.order })),
    });

    return response.map(video => ({
      id: video._id || '',
      title: video.title || '',
      thumbnail: video.thumbnail || '',
      videoUrl: video.videoUrl || '',
      duration: video.duration || '0:00',
    }));
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const token = sessionStorage.getItem('zeinab-admin-token');
    
    const baseUrl = (API_BASE_URL || '').replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/api/upload/image`, {
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

  async uploadVideo(file: File): Promise<{ url: string; thumbnail?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const token = sessionStorage.getItem('zeinab-admin-token');
    
    const baseUrl = (API_BASE_URL || '').replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/api/upload/video`, {
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
    return {
      url: data.url,
      thumbnail: data.thumbnail || undefined,
    };
  }
}

export const videoEditorApi = new VideoEditorApi();
