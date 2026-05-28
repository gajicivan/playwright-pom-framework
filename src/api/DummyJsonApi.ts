import { APIRequestContext, APIResponse } from '@playwright/test';

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
}

export class DummyJsonApi {
  constructor(private readonly request: APIRequestContext) {}

  async listUsers(limit = 5): Promise<APIResponse> {
    return this.request.get(`/users?limit=${limit}`);
  }

  async getUser(id: number): Promise<APIResponse> {
    return this.request.get(`/users/${id}`);
  }

  async login(input: LoginInput): Promise<APIResponse> {
    return this.request.post('/auth/login', { data: input });
  }

  async getCurrentUser(token: string): Promise<APIResponse> {
    return this.request.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
