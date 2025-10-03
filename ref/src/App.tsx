import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './components/HomePage';
import Login from './components/Login/Login';
import DashboardLayout from './components/Layout/DashboardLayout';
import StudentDashboard from './components/Student/StudentDashboard';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import AttendanceManagement from './components/Teacher/AttendanceManagement';
import HomeworkManagement from './components/Teacher/HomeworkManagement';
import GradeManagement from './components/Teacher/GradeManagement';
import NoticeManagement from './components/Teacher/NoticeManagement';
import TeacherCalendarManagement from './components/Teacher/CalendarManagement';
import StudentsView from './components/Teacher/StudentsView';
import Dashboard from './components/Admin/AdminDashboard';
import StudentManagement from './components/Admin/StudentManagement';
import TeacherManagement from './components/Admin/TeacherManagement';
import ClassesManagement from './components/Admin/ClassesManagement';
import CalendarManagement from './components/Admin/CalendarManagement';
import Settings from './components/Admin/Settings';



// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole: string }> = ({ children, allowedRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return React.createElement('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' } }, 'Loading...');
  }

  if (!isAuthenticated) {
    return React.createElement(Navigate, { to: '/', replace: true });
  }

  if (user?.role !== allowedRole) {
    return React.createElement(Navigate, { to: '/', replace: true });
  }

  return React.createElement(React.Fragment, null, children);
};

function App() {
  return React.createElement(AuthProvider, null,
    React.createElement(Router, null,
      React.createElement(Routes, null,
        React.createElement(Route, { path: '/', element: React.createElement(HomePage) }),
        React.createElement(Route, { 
          path: '/student-login', 
          element: React.createElement(Login, { userType: 'student' })
        }),
        React.createElement(Route, { 
          path: '/teacher-login', 
          element: React.createElement(Login, { userType: 'teacher' })
        }),
        React.createElement(Route, { 
          path: '/admin-login', 
          element: React.createElement(Login, { userType: 'admin' })
        }),
        React.createElement(Route, {
          path: '/student-dashboard',
          element: React.createElement(ProtectedRoute, { allowedRole: 'student', children: React.createElement(StudentDashboard) })
        }),
        React.createElement(Route, {
          path: '/teacher-dashboard',
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(DashboardLayout, { title: 'Teacher Dashboard', children: React.createElement(TeacherDashboard) }) })
        }),
        React.createElement(Route, {
          path: '/teacher/attendance',
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(DashboardLayout, { title: 'Attendance Management', children: React.createElement(AttendanceManagement) }) })
        }),
        React.createElement(Route, {
          path: '/teacher/homework',
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(DashboardLayout, { title: 'Homework Management', children: React.createElement(HomeworkManagement) }) })
        }),
        React.createElement(Route, {
          path: '/teacher/grades',
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(DashboardLayout, { title: 'Grade Management', children: React.createElement(GradeManagement) }) })
        }),
        React.createElement(Route, {
          path: '/teacher/notices',
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(DashboardLayout, { title: 'Notice Management', children: React.createElement(NoticeManagement) }) })
        }),
        React.createElement(Route, {
          path: '/teacher/calendar',
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(DashboardLayout, { title: 'Calendar Management', children: React.createElement(TeacherCalendarManagement) }) })
        }),
        React.createElement(Route, {
          path: '/teacher/students',
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(DashboardLayout, { title: 'Student Information', children: React.createElement(StudentsView) }) })
        }),
        React.createElement(Route, {
          path: '/admin-dashboard',
          element: React.createElement(ProtectedRoute, { allowedRole: 'admin', children: React.createElement(Dashboard) })
        }),
        React.createElement(Route, {
          path: '/admin/students',
          element: React.createElement(ProtectedRoute, { allowedRole: 'admin', children: React.createElement(StudentManagement) })
        }),
        React.createElement(Route, {
          path: '/admin/teachers',
          element: React.createElement(ProtectedRoute, { allowedRole: 'admin', children: React.createElement(TeacherManagement) })
        }),
        React.createElement(Route, {
          path: '/admin/classes',
          element: React.createElement(ProtectedRoute, { allowedRole: 'admin', children: React.createElement(ClassesManagement) })
        }),
        React.createElement(Route, {
          path: '/admin/calendar',
          element: React.createElement(ProtectedRoute, { allowedRole: 'admin', children: React.createElement(CalendarManagement) })
        }),
        React.createElement(Route, {
          path: '/admin/settings',
          element: React.createElement(ProtectedRoute, { allowedRole: 'admin', children: React.createElement(Settings) })
        }),
        React.createElement(Route, {
          path: '*',
          element: React.createElement(Navigate, { to: '/', replace: true })
        })
      )
    )
  );
}

export default App;