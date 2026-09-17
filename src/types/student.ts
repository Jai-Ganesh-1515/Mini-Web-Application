export interface Student {
  id: number;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  section: string;
  dateOfBirth: string;
  address?: string;
  createdAt?: string;
}

export interface StudentFormData {
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  section: string;
  dateOfBirth: string;
  address: string;
}

export interface ApiResponse<T = any> {
  status: number;
  statusText: string;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
  validationErrors?: Record<string, string>;
  durationMs?: number;
}

export interface FilterState {
  searchQuery: string;
  department: string;
  year: string;
  section: string;
}
