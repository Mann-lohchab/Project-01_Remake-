import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './components/HomePage';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';
import StudentDashboard from './components/Student/StudentDashboard';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import AttendanceManagement from './components/Teacher/AttendanceManagement';
import HomeworkManagement from './components/Teacher/HomeworkManagement';
import GradeManagement from './components/Teacher/GradeManagement';
import NoticeManagement from './components/Teacher/NoticeManagement';
import CalendarManagement from './components/Teacher/CalendarManagement';
import StudentsView from './components/Teacher/StudentsView';


const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return React.createElement(Layout, { title: 'Admin Dashboard', children:
    React.createElement('div', null,
      React.createElement('h2', null, `Welcome, ${user?.firstName}!`),
      React.createElement('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8'
      },
        React.createElement('div', {
          className: 'bg-white p-5 rounded-lg shadow-md'
        },
          React.createElement('h3', { className: 'text-blue-500' }, 'Manage Students'),
          React.createElement('p', null, 'Add, edit, and view students')
        ),
        React.createElement('div', {
          className: 'bg-white p-5 rounded-lg shadow-md'
        },
          React.createElement('h3', { className: 'text-emerald-500' }, 'Manage Teachers'),
          React.createElement('p', null, 'Add, edit, and view teachers')
        ),
        React.createElement('div', {
          className: 'bg-white p-5 rounded-lg shadow-md'
        },
          React.createElement('h3', { className: 'text-amber-500' }, 'Calendar'),
          React.createElement('p', null, 'Manage school calendar events')
        ),
        React.createElement('div', {
          className: 'bg-white p-5 rounded-lg shadow-md'
        },
          React.createElement('h3', { className: 'text-red-500' }, 'Reports'),
          React.createElement('p', null, 'View system reports and analytics')
        )
      )
    ) });
};

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole: string }> = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();
  
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
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(Layout, { title: 'Teacher Dashboard', children: React.createElement(TeacherDashboard) }) })
        }),
        React.createElement(Route, { 
          path: '/teacher/attendance', 
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(Layout, { title: 'Attendance Management', children: React.createElement(AttendanceManagement) }) })
        }),
        React.createElement(Route, { 
          path: '/teacher/homework', 
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(Layout, { title: 'Homework Management', children: React.createElement(HomeworkManagement) }) })
        }),
        React.createElement(Route, { 
          path: '/teacher/grades', 
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(Layout, { title: 'Grade Management', children: React.createElement(GradeManagement) }) })
        }),
        React.createElement(Route, { 
          path: '/teacher/notices', 
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(Layout, { title: 'Notice Management', children: React.createElement(NoticeManagement) }) })
        }),
        React.createElement(Route, { 
          path: '/teacher/calendar', 
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(Layout, { title: 'Calendar Management', children: React.createElement(CalendarManagement) }) })
        }),
        React.createElement(Route, { 
          path: '/teacher/students', 
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(Layout, { title: 'Student Information', children: React.createElement(StudentsView) }) })
        }),
        React.createElement(Route, { 
          path: '/admin-dashboard', 
          element: React.createElement(ProtectedRoute, { allowedRole: 'admin', children: React.createElement(AdminDashboard) })
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