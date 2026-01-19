import { apiService } from './api';

export type SocialIcon = 
  | 'Instagram'
  | 'Phone'
  | 'Mail'
  | 'Facebook'
  | 'Twitter'
  | 'LinkedIn'
  | 'YouTube'
  | 'TikTok'
  | 'WhatsApp'
  | 'MapPin'
  | 'Globe';

export interface SocialLink {
  icon: SocialIcon;
  label: string;
  url: string;
  displayText: string;
}

export interface ContactData {
  quote: string;
  socialLinks: SocialLink[];
}

interface RawContactResponse {
  quote: string;
  socialLinks: Array<{
    icon: SocialIcon;
    label: string;
    url: string;
    displayText: string;
  }>;
}

class PublicContactApi {
  /**
   * Get contact information for public display
   * This endpoint is accessible without authentication
   */
  async getContact(): Promise<ContactData> {
    try {
      const response = await apiService.get<RawContactResponse>('/contact');
      
      return {
        quote: response.quote || '',
        socialLinks: response.socialLinks || [],
      };
    } catch (error) {
      console.error('Failed to fetch contact:', error);
      return {
        quote: '',
        socialLinks: [],
      };
    }
  }
}

export const publicContactApi = new PublicContactApi();
