import axios, { AxiosResponse } from 'axios';
import { LoginCredentials, Student, Teacher, Admin } from '../types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/' && !window.location.pathname.includes('login')) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  // Student login
  studentLogin: async (credentials: LoginCredentials): Promise<{ token: string; user: Student }> => {
    const response: AxiosResponse<{ token: string; user: Student }> = await api.post('/students/login', {
      studentID: credentials.id,
      password: credentials.password,
    });
    return response.data;
  },

  // Teacher login
  teacherLogin: async (credentials: LoginCredentials): Promise<{ token: string; user: Teacher }> => {
    const response: AxiosResponse<{ token: string; user: Teacher }> = await api.post('/teachers/login', {
      teacherID: credentials.id,
      password: credentials.password,
    });
    return response.data;
  },

  // Admin login
  adminLogin: async (credentials: LoginCredentials): Promise<{ token: string; user: Admin }> => {
    const response: AxiosResponse<{ token: string; user: Admin }> = await api.post('/admin/login', {
      adminID: credentials.id,
      password: credentials.password,
    });
    return response.data;
  },

  // Student registration
  studentRegister: async (userData: Partial<Student>): Promise<{ token: string; user: Student }> => {
    const response: AxiosResponse<{ token: string; user: Student }> = await api.post('/students/register', userData);
    return response.data;
  },
};

// Student APIs
export const studentAPI = {
  // Get attendance
  getAttendance: async (studentID: string) => {
    const response = await api.get(`/students/Attendance/${studentID}`);
    return response.data;
  },

  // Get homework
  getHomework: async (studentID: string) => {
    const response = await api.get(`/students/Homework/${studentID}`);
    return response.data;
  },

  // Get marks
  getMarks: async (studentID: string) => {
    const response = await api.get(`/students/Marks/${studentID}`);
    return response.data;
  },

  // Get notices
  getNotices: async (studentID: string) => {
    const response = await api.get(`/students/Notice/${studentID}`);
    return response.data;
  },
  

  // Get calendar events
  getCalendar: async (studentID: string) => {
    const response = await api.get(`/students/Calendar/${studentID}`);
    return response.data;
  },

  // Get timetable
  getTimetable: async (studentID: string) => {
    const response = await api.get(`/students/Timetable/${studentID}`);
    return response.data;
  },
};

// Teacher APIs (simplified for now)
export const teacherAPI = {
  // Get students for attendance
  getStudents: async () => {
    const response = await api.get('/teachers/students');
    return response.data;
  },

  // Mark attendance
  markAttendance: async (attendanceData: any) => {
    const response = await api.post('/teachers/Attendance', attendanceData);
    return response.data;
  },

  // Manage homework
  createHomework: async (homeworkData: any) => {
    const response = await api.post('/teachers/Homework', homeworkData);
    return response.data;
  },

  // Manage marks
  addMarks: async (marksData: any) => {
    const response = await api.post('/teachers/Marks', marksData);
    return response.data;
  },

  // Create notice
  createNotice: async (noticeData: any) => {
    const response = await api.post('/teachers/Notice', noticeData);
    return response.data;
  },
};

// Admin APIs
export const adminAPI = {
  // Student management
  getStudents: async () => {
    const response = await api.get('/admin/students');
    return response.data;
  },

  getStudentById: async (id: string) => {
    const response = await api.get(`/admin/students/${id}`);
    return response.data;
  },

  addStudent: async (studentData: any) => {
    const response = await api.post('/admin/students', studentData);
    return response.data;
  },

  updateStudent: async (id: string, studentData: any) => {
    const response = await api.patch(`/admin/students/${id}`, studentData);
    return response.data;
  },

  deleteStudent: async (id: string) => {
    const response = await api.delete(`/admin/students/${id}`);
    return response.data;
  },

  // Teacher management
  getTeachers: async () => {
    const response = await api.get('/admin/teachers');
    return response.data;
  },

  getTeacherById: async (id: string) => {
    const response = await api.get(`/admin/teachers/${id}`);
    return response.data;
  },

  createTeacher: async (teacherData: any) => {
    const response = await api.post('/admin/teachers', teacherData);
    return response.data;
  },

  updateTeacher: async (id: string, teacherData: any) => {
    const response = await api.patch(`/admin/teachers/${id}`, teacherData);
    return response.data;
  },

  deleteTeacher: async (id: string) => {
    const response = await api.delete(`/admin/teachers/${id}`);
    return response.data;
  },

  // Calendar management
  getCalendarEvents: async () => {
    const response = await api.get('/admin/calendar');
    return response.data;
  },

  createCalendarEvent: async (eventData: any) => {
    const response = await api.post('/admin/calendar', eventData);
    return response.data;
  },

  updateCalendarEvent: async (id: string, eventData: any) => {
    const response = await api.patch(`/admin/calendar/${id}`, eventData);
    return response.data;
  },

  deleteCalendarEvent: async (id: string) => {
    const response = await api.delete(`/admin/calendar/${id}`);
    return response.data;
  },
};

export default api;