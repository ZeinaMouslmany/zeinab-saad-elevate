import { apiService } from './api';
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

class PublicVideoApi {
  /**
   * Get all Videos for public display
   * This endpoint is accessible without authentication
   */
  async getVideos(): Promise<Video[]> {
    try {
      const response = await apiService.get<RawVideoResponse[]>('/videos');
      
      return response.map(video => ({
        id: video._id || video.id || '',
        title: video.title || '',
        thumbnail: video.thumbnail || '',
        videoUrl: video.videoUrl || '',
        duration: video.duration || '0:00',
      }));
    } catch (error) {
      console.error('Failed to fetch Videos:', error);
      return [];
    }
  }
}

export const publicVideoApi = new PublicVideoApi();
