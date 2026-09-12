const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from local storage or wherever it's stored
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async getMe() {
    return this.request('/auth/me');
  }

  // Product endpoints
  async getProducts(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const url = queryString ? `/products?${queryString}` : '/products';
    return this.request(url);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(data: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Category endpoints
  async getCategories() {
    return this.request('/categories');
  }

  // Inquiry endpoints
  async createInquiry(data: any) {
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getInquiries(role: 'BUYER' | 'SUPPLIER') {
    return this.request(`/inquiries?role=${role}`);
  }
}

export const api = new ApiService();
