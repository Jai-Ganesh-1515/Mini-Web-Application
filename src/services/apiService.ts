import { Student, StudentFormData, ApiResponse } from '../types/student';
import { INITIAL_STUDENTS } from '../data/initialStudents';

const STORAGE_KEY = 'sms_student_records_v2';
const BACKEND_MODE_KEY = 'sms_backend_mode';
const BACKEND_URL_KEY = 'sms_backend_url';

export const getBackendMode = (): 'simulated' | 'live' => {
  return (localStorage.getItem(BACKEND_MODE_KEY) as 'simulated' | 'live') || 'simulated';
};

export const setBackendMode = (mode: 'simulated' | 'live') => {
  localStorage.setItem(BACKEND_MODE_KEY, mode);
};

export const getBackendUrl = (): string => {
  return localStorage.getItem(BACKEND_URL_KEY) || 'http://localhost:8080';
};

export const setBackendUrl = (url: string) => {
  localStorage.setItem(BACKEND_URL_KEY, url);
};

export const resetToDefaultSeedData = (): Student[] => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
  return INITIAL_STUDENTS;
};

// Local storage helper
const getStoredStudents = (): Student[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load students from localStorage:', err);
    return INITIAL_STUDENTS;
  }
};

const saveStoredStudents = (students: Student[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

// Simulated delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Validation logic matching Spring Boot @NotBlank, @Email, etc.
export const validateStudentData = (
  data: Partial<StudentFormData>,
  existingId?: number
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.rollNumber || !data.rollNumber.trim()) {
    errors.rollNumber = 'Roll number is mandatory';
  } else if (!/^[A-Za-z0-9_-]{3,20}$/.test(data.rollNumber.trim())) {
    errors.rollNumber = 'Roll number must be 3-20 alphanumeric characters (e.g. 24CSE101)';
  } else {
    // Check uniqueness
    const all = getStoredStudents();
    const isDuplicate = all.some(
      (s) => s.rollNumber.toLowerCase() === data.rollNumber!.trim().toLowerCase() && s.id !== existingId
    );
    if (isDuplicate) {
      errors.rollNumber = `Student with roll number '${data.rollNumber.trim()}' already exists`;
    }
  }

  if (!data.name || !data.name.trim()) {
    errors.name = 'Student name is mandatory';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address is mandatory';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address';
  }

  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'Phone number is mandatory';
  } else if (!/^\d{10}$/.test(data.phone.trim().replace(/\D/g, ''))) {
    errors.phone = 'Phone number must contain exactly 10 digits';
  }

  if (!data.department || !data.department.trim()) {
    errors.department = 'Department is mandatory';
  }

  if (!data.year || !data.year.trim()) {
    errors.year = 'Academic year is mandatory';
  }

  if (!data.section || !data.section.trim()) {
    errors.section = 'Section is mandatory';
  }

  if (!data.dateOfBirth || !data.dateOfBirth.trim()) {
    errors.dateOfBirth = 'Date of birth is mandatory';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export const resetToInitialData = (): Student[] => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
  return INITIAL_STUDENTS;
};

// API Client Methods matching Spring Boot Controller
export const studentApi = {
  // GET /api/students
  async getAllStudents(): Promise<ApiResponse<Student[]>> {
    const startTime = performance.now();
    const mode = getBackendMode();

    if (mode === 'live') {
      try {
        const res = await fetch(`${getBackendUrl()}/api/students`);
        const data = await res.json();
        return {
          status: res.status,
          statusText: res.statusText,
          data: res.ok ? data : undefined,
          error: !res.ok ? 'Failed to fetch' : undefined,
          durationMs: Math.round(performance.now() - startTime)
        };
      } catch (err: any) {
        return {
          status: 500,
          statusText: 'Internal Server Error',
          error: `Could not connect to Spring Boot server at ${getBackendUrl()}. Make sure the backend is running and CORS is enabled.`,
          durationMs: Math.round(performance.now() - startTime)
        };
      }
    }

    // Simulated Spring Boot endpoint
    await delay(120);
    const students = getStoredStudents();
    return {
      status: 200,
      statusText: 'OK',
      data: students,
      durationMs: Math.round(performance.now() - startTime)
    };
  },

  // GET /api/students/{id}
  async getStudentById(id: number): Promise<ApiResponse<Student>> {
    const startTime = performance.now();
    const mode = getBackendMode();

    if (mode === 'live') {
      try {
        const res = await fetch(`${getBackendUrl()}/api/students/${id}`);
        const data = await res.json();
        return {
          status: res.status,
          statusText: res.statusText,
          data: res.ok ? data : undefined,
          error: !res.ok ? data.message || 'Error' : undefined,
          durationMs: Math.round(performance.now() - startTime)
        };
      } catch (err: any) {
        return {
          status: 500,
          statusText: 'Error',
          error: err.message,
          durationMs: Math.round(performance.now() - startTime)
        };
      }
    }

    await delay(100);
    const students = getStoredStudents();
    const student = students.find((s) => s.id === id);

    if (!student) {
      return {
        status: 404,
        statusText: 'NOT FOUND',
        error: 'Not Found',
        message: `Student not found with id : ${id}`,
        timestamp: new Date().toISOString(),
        durationMs: Math.round(performance.now() - startTime)
      };
    }

    return {
      status: 200,
      statusText: 'OK',
      data: student,
      durationMs: Math.round(performance.now() - startTime)
    };
  },

  // POST /api/students
  async createStudent(studentData: StudentFormData): Promise<ApiResponse<Student>> {
    const startTime = performance.now();
    const mode = getBackendMode();

    if (mode === 'live') {
      try {
        const res = await fetch(`${getBackendUrl()}/api/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData)
        });
        const data = await res.json();
        return {
          status: res.status,
          statusText: res.statusText,
          data: res.ok ? data : undefined,
          message: res.ok ? 'Student created successfully' : data.message,
          error: !res.ok ? data.error || 'Bad Request' : undefined,
          validationErrors: data.errors,
          durationMs: Math.round(performance.now() - startTime)
        };
      } catch (err: any) {
        return {
          status: 500,
          statusText: 'Error',
          error: err.message,
          durationMs: Math.round(performance.now() - startTime)
        };
      }
    }

    await delay(150);
    const validation = validateStudentData(studentData);
    if (!validation.valid) {
      if (validation.errors.rollNumber && validation.errors.rollNumber.includes('already exists')) {
        return {
          status: 409,
          statusText: 'CONFLICT',
          error: 'Conflict',
          message: validation.errors.rollNumber,
          timestamp: new Date().toISOString(),
          durationMs: Math.round(performance.now() - startTime)
        };
      }
      return {
        status: 400,
        statusText: 'BAD REQUEST',
        error: 'Validation Failed',
        message: 'Invalid input data. Please correct the highlighted fields.',
        validationErrors: validation.errors,
        timestamp: new Date().toISOString(),
        durationMs: Math.round(performance.now() - startTime)
      };
    }

    const students = getStoredStudents();
    const nextId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
    const newStudent: Student = {
      id: nextId,
      rollNumber: studentData.rollNumber.trim().toUpperCase(),
      name: studentData.name.trim(),
      email: studentData.email.trim().toLowerCase(),
      phone: studentData.phone.trim(),
      department: studentData.department,
      year: studentData.year,
      section: studentData.section,
      dateOfBirth: studentData.dateOfBirth,
      address: studentData.address ? studentData.address.trim() : undefined,
      createdAt: new Date().toISOString()
    };

    students.unshift(newStudent);
    saveStoredStudents(students);

    return {
      status: 201,
      statusText: 'CREATED',
      data: newStudent,
      message: 'Student registered successfully',
      timestamp: new Date().toISOString(),
      durationMs: Math.round(performance.now() - startTime)
    };
  },

  // PUT /api/students/{id}
  async updateStudent(id: number, studentData: StudentFormData): Promise<ApiResponse<Student>> {
    const startTime = performance.now();
    const mode = getBackendMode();

    if (mode === 'live') {
      try {
        const res = await fetch(`${getBackendUrl()}/api/students/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData)
        });
        const data = await res.json();
        return {
          status: res.status,
          statusText: res.statusText,
          data: res.ok ? data : undefined,
          message: res.ok ? 'Student updated successfully' : data.message,
          error: !res.ok ? data.error || 'Error' : undefined,
          validationErrors: data.errors,
          durationMs: Math.round(performance.now() - startTime)
        };
      } catch (err: any) {
        return {
          status: 500,
          statusText: 'Error',
          error: err.message,
          durationMs: Math.round(performance.now() - startTime)
        };
      }
    }

    await delay(150);
    const students = getStoredStudents();
    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
      return {
        status: 404,
        statusText: 'NOT FOUND',
        error: 'Not Found',
        message: `Student not found with id : ${id}`,
        timestamp: new Date().toISOString(),
        durationMs: Math.round(performance.now() - startTime)
      };
    }

    const validation = validateStudentData(studentData, id);
    if (!validation.valid) {
      if (validation.errors.rollNumber && validation.errors.rollNumber.includes('already exists')) {
        return {
          status: 409,
          statusText: 'CONFLICT',
          error: 'Conflict',
          message: validation.errors.rollNumber,
          timestamp: new Date().toISOString(),
          durationMs: Math.round(performance.now() - startTime)
        };
      }
      return {
        status: 400,
        statusText: 'BAD REQUEST',
        error: 'Validation Failed',
        validationErrors: validation.errors,
        message: 'Invalid input data. Please correct the highlighted fields.',
        timestamp: new Date().toISOString(),
        durationMs: Math.round(performance.now() - startTime)
      };
    }

    const updatedStudent: Student = {
      ...students[index],
      rollNumber: studentData.rollNumber.trim().toUpperCase(),
      name: studentData.name.trim(),
      email: studentData.email.trim().toLowerCase(),
      phone: studentData.phone.trim(),
      department: studentData.department,
      year: studentData.year,
      section: studentData.section,
      dateOfBirth: studentData.dateOfBirth,
      address: studentData.address ? studentData.address.trim() : undefined
    };

    students[index] = updatedStudent;
    saveStoredStudents(students);

    return {
      status: 200,
      statusText: 'OK',
      data: updatedStudent,
      message: 'Student record updated successfully',
      timestamp: new Date().toISOString(),
      durationMs: Math.round(performance.now() - startTime)
    };
  },

  // DELETE /api/students/{id}
  async deleteStudent(id: number): Promise<ApiResponse<{ message: string }>> {
    const startTime = performance.now();
    const mode = getBackendMode();

    if (mode === 'live') {
      try {
        const res = await fetch(`${getBackendUrl()}/api/students/${id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        return {
          status: res.status,
          statusText: res.statusText,
          message: data.message || 'Student deleted successfully',
          data,
          error: !res.ok ? data.error || 'Error' : undefined,
          durationMs: Math.round(performance.now() - startTime)
        };
      } catch (err: any) {
        return {
          status: 500,
          statusText: 'Error',
          error: err.message,
          durationMs: Math.round(performance.now() - startTime)
        };
      }
    }

    await delay(120);
    const students = getStoredStudents();
    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
      return {
        status: 404,
        statusText: 'NOT FOUND',
        error: 'Not Found',
        message: `Student not found with id : ${id}`,
        timestamp: new Date().toISOString(),
        durationMs: Math.round(performance.now() - startTime)
      };
    }

    const deleted = students.splice(index, 1)[0];
    saveStoredStudents(students);

    return {
      status: 200,
      statusText: 'OK',
      message: `Student '${deleted.name}' (Roll No: ${deleted.rollNumber}) deleted successfully`,
      data: { message: `Student deleted successfully with id : ${id}` },
      timestamp: new Date().toISOString(),
      durationMs: Math.round(performance.now() - startTime)
    };
  },

  // GET /api/students/search?name={value}
  async searchStudents(query: string): Promise<ApiResponse<Student[]>> {
    const startTime = performance.now();
    const mode = getBackendMode();

    if (mode === 'live') {
      try {
        const res = await fetch(`${getBackendUrl()}/api/students/search?name=${encodeURIComponent(query)}`);
        const data = await res.json();
        return {
          status: res.status,
          statusText: res.statusText,
          data: res.ok ? data : [],
          error: !res.ok ? data.error : undefined,
          durationMs: Math.round(performance.now() - startTime)
        };
      } catch (err: any) {
        return {
          status: 500,
          statusText: 'Error',
          error: err.message,
          durationMs: Math.round(performance.now() - startTime)
        };
      }
    }

    await delay(80);
    const students = getStoredStudents();
    const term = query.toLowerCase().trim();

    if (!term) {
      return {
        status: 200,
        statusText: 'OK',
        data: students,
        durationMs: Math.round(performance.now() - startTime)
      };
    }

    const filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.rollNumber.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.department.toLowerCase().includes(term)
    );

    return {
      status: 200,
      statusText: 'OK',
      data: filtered,
      durationMs: Math.round(performance.now() - startTime)
    };
  }
};
