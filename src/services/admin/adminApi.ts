import { apiService } from '../api';

interface LoginRequest {
  password: string;
}

interface LoginResponse {
  token: string;
}

interface AdminProfile {
  id: string;
  createdAt: string;
}

export const adminApi = {
  async login(password: string): Promise<LoginResponse> {
    return apiService.post<LoginResponse, LoginRequest>('/admin/login', { password });
  },

  async getProfile(): Promise<AdminProfile> {
    return apiService.get<AdminProfile>('/admin/profile');
  },

  setAuthToken(token: string) {
    apiService.setAuthToken(token);
  },
};
