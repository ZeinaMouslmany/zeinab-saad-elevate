import { apiService } from '../api';
import { SocialIcon, SocialLink, ContactData } from '../contactApi';

interface RawContactResponse {
  _id: string;
  quote: string;
  socialLinks: Array<{
    _id?: string;
    icon: SocialIcon;
    label: string;
    url: string;
    displayText: string;
    order: number;
    enabled: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

class ContactApi {
  async getContact(): Promise<ContactData & { socialLinks: Array<SocialLink & { id?: string; order?: number; enabled?: boolean }> }> {
    const response = await apiService.get<RawContactResponse>('/admin/contact');
    
    return {
      quote: response.quote || '',
      socialLinks: (response.socialLinks || []).map((link, index) => ({
        ...(link._id && { id: link._id.toString() }),
        icon: link.icon,
        label: link.label,
        url: link.url,
        displayText: link.displayText,
        order: link.order ?? index,
        enabled: link.enabled !== undefined ? link.enabled : true,
      })),
    };
  }

  async updateContact(data: ContactData & { socialLinks: Array<SocialLink & { id?: string; order?: number; enabled?: boolean }> }): Promise<ContactData & { socialLinks: Array<SocialLink & { id?: string; order?: number; enabled?: boolean }> }> {
    type ExtendedSocialLink = SocialLink & { id?: string; order?: number; enabled?: boolean };
    const links = (data.socialLinks || []) as ExtendedSocialLink[];
    
    const response = await apiService.put<RawContactResponse>('/admin/contact', {
      quote: data.quote,
      socialLinks: links.map((link) => ({
        icon: link.icon,
        label: link.label,
        url: link.url,
        displayText: link.displayText,
        enabled: link.enabled !== undefined ? link.enabled : true,
      })),
    });

    return {
      quote: response.quote || '',
      socialLinks: (response.socialLinks || []).map((link, index) => ({
        ...(link._id && { id: link._id.toString() }),
        icon: link.icon,
        label: link.label,
        url: link.url,
        displayText: link.displayText,
        order: link.order ?? index,
        enabled: link.enabled !== undefined ? link.enabled : true,
      })),
    };
  }
}

export const contactApi = new ContactApi();
