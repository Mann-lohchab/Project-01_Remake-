import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: 'Mark Attendance',
      description: 'Record student attendance for classes',
      color: '#3b82f6',
      path: '/teacher/attendance',
      icon: '📋'
    },
    {
      title: 'Assign Homework',
      description: 'Create and manage assignments',
      color: '#10b981',
      path: '/teacher/homework',
      icon: '📚'
    },
    {
      title: 'Grade Tests',
      description: 'Enter and manage student marks',
      color: '#f59e0b',
      path: '/teacher/grades',
      icon: '📊'
    },
    {
      title: 'Send Notices',
      description: 'Post announcements to students',
      color: '#ef4444',
      path: '/teacher/notices',
      icon: '📢'
    },
    {
      title: 'Manage Calendar',
      description: 'Add events and manage schedule',
      color: '#8b5cf6',
      path: '/teacher/calendar',
      icon: '📅'
    },
    {
      title: 'View Students',
      description: 'View and manage student information',
      color: '#06b6d4',
      path: '/teacher/students',
      icon: '👥'
    }
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>
          Welcome, {user?.firstName}!
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Teacher Dashboard - Manage your classes and students
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '30px'
      }}>
        {dashboardItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(item.path)}
            style={{
              background: 'white',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: '1px solid #f3f4f6'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
            }}
          >
            <div style={{ 
              fontSize: '36px', 
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {item.icon}
            </div>
            <h3 style={{ 
              color: item.color, 
              marginBottom: '10px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              {item.title}
            </h3>
            <p style={{ 
              color: '#6b7280',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;