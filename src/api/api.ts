import { FormData } from '../types';

const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3000' : '';

export const api = {
  async submitForm(data: Omit<FormData, 'id'>): Promise<FormData> {
    const response = await fetch(`${API_BASE_URL}/api/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit form');
    }

    const result = await response.json();
    return result.data;
  },

  async getSubmissions(): Promise<FormData[]> {
    const response = await fetch(`${API_BASE_URL}/api/submissions`);

    if (!response.ok) {
      throw new Error('Failed to fetch submissions');
    }

    return await response.json();
  },
  async uploadFile(formData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData as any,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('File uploaded successfully:', data);
      } else {
        console.error('Upload failed:', data.message);
      }
    } catch (error) {
      console.error(' Error uploading file:', error);
    }
  },
};
