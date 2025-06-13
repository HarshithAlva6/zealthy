const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  async get<T = any>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE}/api${endpoint}`,{
      credentials: 'include', 
    });
    if (!response.ok) throw { message: 'HTTP error!', status: response.status };
    return response.json();
  },
  
  async post<T = any>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE}/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    if (!response.ok) throw { message: 'HTTP error!', status: response.status };
    return response.json();
  },
  
  async put<T = any>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE}/api${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    if (!response.ok) throw { message: 'HTTP error!', status: response.status };
    return response.json();
  }
};