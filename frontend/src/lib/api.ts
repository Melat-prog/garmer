const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from local storage
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
  async register(data: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

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

  // Inquiry & RFQ endpoints
  async createInquiry(data: { productId: string; quantity: number | string; country: string; message: string }) {
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getInquiries(role?: 'BUYER' | 'SUPPLIER' | 'ADMIN') {
    const url = role ? `/inquiries?role=${role}` : '/inquiries';
    return this.request(url);
  }

  async getInquiry(id: string) {
    return this.request(`/inquiries/${id}`);
  }

  async forwardInquiry(id: string, supplierId?: string) {
    return this.request(`/inquiries/${id}/forward`, {
      method: 'POST',
      body: JSON.stringify({ supplierId })
    });
  }

  async rejectInquiryByAdmin(id: string) {
    return this.request(`/inquiries/${id}/admin-reject`, {
      method: 'POST'
    });
  }

  async submitSupplierQuotation(id: string, data: { unitPrice: number; shippingCost: number; deliveryTimeline: string; paymentTerms: string; supplierNotes?: string }) {
    return this.request(`/inquiries/${id}/quotation`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async approveAndReleaseQuotation(id: string, data: { markupAmount: number; adminNotes?: string }) {
    return this.request(`/inquiries/${id}/approve-quotation`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async acceptQuotation(id: string) {
    return this.request(`/inquiries/${id}/accept`, {
      method: 'POST'
    });
  }

  async rejectQuotation(id: string) {
    return this.request(`/inquiries/${id}/reject`, {
      method: 'POST'
    });
  }

  // Supplier endpoints
  async getSuppliers() {
    return this.request('/suppliers');
  }

  async getSupplier(id: string) {
    return this.request(`/suppliers/${id}`);
  }
}

export const api = new ApiService();
