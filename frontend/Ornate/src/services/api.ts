import type { Jewelry, SearchFilters } from '../types/jewelry';

const API_BASE_URL = "http://localhost:8000";

export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error("Health check failed");
  }
  return response.json();
}

// Backend uses different field names, so we need to map them
interface BackendJewellery {
  id: string;
  name?: string;
  image_url: string;
  category: string;
  style?: string[];
  outfit_type?: string[];
  occasion?: string[];
  primary_colors?: string[];
  secondary_colors?: string[];
  material?: string;
  notes?: string;
  created_at: string;
}

interface BackendJewelleryCreate {
  name?: string;
  image_url: string;
  category: string;
  style?: string[];
  outfit_type?: string[];
  occasion?: string[];
  primary_colors?: string[];
  secondary_colors?: string[];
  material?: string;
  notes?: string;
}

// Convert frontend Jewelry to backend format
function toBackendFormat(jewelry: Partial<Jewelry>): BackendJewelleryCreate {
  return {
    name: jewelry.name,
    image_url: jewelry.imageUrl || '',
    category: jewelry.category || '',
    style: [], // Can be mapped from outfitTypes if needed
    outfit_type: jewelry.outfitTypes || [],
    occasion: jewelry.occasion || [],
    primary_colors: jewelry.color ? [jewelry.color] : [],
    secondary_colors: [],
    material: jewelry.material || undefined,
    notes: jewelry.description || undefined,
  };
}

// Convert backend format to frontend Jewelry
function fromBackendFormat(backend: BackendJewellery): Jewelry {
  return {
    id: backend.id,
    name: backend.name || backend.category,
    category: backend.category as any,
    imageUrl: backend.image_url,
    description: backend.notes,
    outfitTypes: (backend.outfit_type || []) as any[],
    color: backend.primary_colors?.[0],
    material: backend.material,
    occasion: backend.occasion,
    createdAt: backend.created_at,
  };
}

export async function getAllJewellery(): Promise<Jewelry[]> {
  const response = await fetch(`${API_BASE_URL}/jewellery/`);
  if (!response.ok) {
    throw new Error("Failed to fetch jewellery");
  }
  const data: BackendJewellery[] = await response.json();
  return data.map(fromBackendFormat);
}

export async function searchJewellery(filters: SearchFilters): Promise<Jewelry[]> {
  const params = new URLSearchParams();
  
  if (filters.category) {
    params.append('category', filters.category);
  }
  
  if (filters.outfitType) {
    params.append('outfit_type', filters.outfitType);
  }
  
  if (filters.searchQuery) {
    params.append('search', filters.searchQuery);
  }
  
  const response = await fetch(`${API_BASE_URL}/jewellery/?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to search jewellery");
  }
  const data: BackendJewellery[] = await response.json();
  return data.map(fromBackendFormat);
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/upload-image`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to upload image: ${error}`);
  }
  
  const data = await response.json();
  return data.image_url;
}

export async function createJewellery(jewelry: Partial<Jewelry>): Promise<Jewelry> {
  const backendData = toBackendFormat(jewelry);
  
  const response = await fetch(`${API_BASE_URL}/jewellery/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(backendData),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create jewellery: ${error}`);
  }
  
  const data: BackendJewellery = await response.json();
  return fromBackendFormat(data);
}

export async function updateJewellery(id: string, jewelry: Partial<Jewelry>): Promise<Jewelry> {
  const backendData = toBackendFormat(jewelry);
  
  const response = await fetch(`${API_BASE_URL}/jewellery/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(backendData),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update jewellery: ${error}`);
  }
  
  const data: BackendJewellery = await response.json();
  return fromBackendFormat(data);
}
