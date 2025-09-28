import axios, { AxiosResponse } from 'axios';
import { LoginCredentials, Student, Teacher, Admin } from '../types';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
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
  getHomework: async () => {
    const response = await api.get('/teachers/Homework');
    return response.data;
  },

  createHomework: async (homeworkData: any) => {
    const response = await api.post('/teachers/Homework', homeworkData);
    return response.data;
  },

  editHomework: async (homeworkData: any) => {
    const response = await api.patch('/teachers/Homework', homeworkData);
    return response.data;
  },

  deleteHomework: async (homeworkData: any) => {
    const response = await api.delete('/teachers/Homework', { data: homeworkData });
    return response.data;
  },

  getHomeworkByRange: async (data: any) => {
    const response = await api.post('/teachers/Homework/range', data);
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

  // Get calendar events
  getCalendar: async () => {
    const response = await api.get('/teachers/Calendar');
    return response.data;
  },

  // Create calendar event
  createCalendarEvent: async (eventData: any) => {
    const response = await api.post('/teachers/Calendar', eventData);
    return response.data;
  },

  // ✅ Add this new method to get all marks,that is the reason i was not able to see the marks
  getMarks: async () => {
    const response = await api.get('/teachers/Marks');
    return response.data;
  },
  deleteMark: async (markId: string) => {
    const response = await api.delete(`/teachers/Marks/${markId}`);
    return response.data;
  },

};

// Admin APIs (simplified for now)
export const adminAPI = {
  // Get all students
  getStudents: async () => {
    const response = await api.get('/admin/students');
    return response.data;
  },

  // Get all teachers
  getTeachers: async () => {
    const response = await api.get('/admin/teachers');
    return response.data;
  },

  // Manage calendar events
  createCalendarEvent: async (eventData: any) => {
    const response = await api.post('/admin/calendar', eventData);
    return response.data;
  },
};

export default api;