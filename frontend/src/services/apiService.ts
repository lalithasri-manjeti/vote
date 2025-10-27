const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://vote-back-5tau.onrender.com/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(username: string, email: string, password: string) {
    const response = await this.request<{
      success: boolean;
      message: string;
      data: {
        user: { id: string; username: string; email: string };
        token: string;
      };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    this.setToken(response.data.token);
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{
      success: boolean;
      message: string;
      data: {
        user: { id: string; username: string; email: string };
        token: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setToken(response.data.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<{
      success: boolean;
      data: { user: { id: string; username: string; email: string } };
    }>('/auth/me');
  }

  // Poll methods
  async getAllPolls(type: 'all' | 'active' | 'mine' = 'all', page = 1, limit = 10) {
    const params = new URLSearchParams({
      type,
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.request<{
      success: boolean;
      data: {
        polls: Poll[];
        pagination: {
          current: number;
          pages: number;
          total: number;
        };
      };
    }>(`/polls?${params}`);
  }

  async getPoll(id: string) {
    return this.request<{
      success: boolean;
      data: { poll: Poll };
    }>(`/polls/${id}`);
  }

  async createPoll(question: string, options: string[], expiresAt?: string) {
    return this.request<{
      success: boolean;
      message: string;
      data: { poll: Poll };
    }>('/polls', {
      method: 'POST',
      body: JSON.stringify({ question, options, expiresAt }),
    });
  }

  async voteOnPoll(pollId: string, optionIndex: number) {
    return this.request<{
      success: boolean;
      message: string;
      data: { poll: Poll };
    }>(`/polls/${pollId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ optionIndex }),
    });
  }

  async updatePoll(pollId: string, question: string, options: string[], expiresAt?: string) {
    return this.request<{
      success: boolean;
      message: string;
      data: { poll: Poll };
    }>(`/polls/${pollId}`, {
      method: 'PUT',
      body: JSON.stringify({ question, options, expiresAt }),
    });
  }

  async deletePoll(pollId: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/polls/${pollId}`, {
      method: 'DELETE',
    });
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export interface Poll {
  _id: string;
  question: string;
  options: { text: string; votes: number }[];
  createdBy: {
    _id: string;
    username: string;
  };
  createdAt: string;
  expiresAt?: string;
  votedUsers: string[];
  isActive: boolean;
  totalVotes?: number;
}

export const apiService = new ApiService();

