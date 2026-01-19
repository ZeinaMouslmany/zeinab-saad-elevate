import { apiService } from '../api';

interface DashboardStats {
  activeServices: number;
  timelineItems: number;
  galleryVideos: number;
  contactMethods: number;
}

interface ContentOverview {
  hero: {
    headline: string;
    tagline: string;
  };
  contact: {
    socialLinksCount: number;
    quote: string;
  };
  about: {
    name: string;
    bioParagraphs: number;
  };
  cta: {
    headline: string;
    buttonText: string;
  };
}

interface LastUpdated {
  hero: string | null;
  about: string | null;
  cta: string | null;
  contact: string | null;
}

interface DashboardResponse {
  stats: DashboardStats;
  contentOverview: ContentOverview;
  lastUpdated: LastUpdated;
}

class DashboardApi {
  /**
   * Get dashboard statistics and content overview
   * Requires authentication
   */
  async getDashboardStats(): Promise<DashboardResponse> {
    try {
      const response = await apiService.get<DashboardResponse>('/admin/dashboard');
      return response;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }
}

export const dashboardApi = new DashboardApi();
export type { DashboardStats, ContentOverview, DashboardResponse };
