import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../Layout/Layout';
import AttendanceView from './AttendanceView';
import HomeworkView from './HomeworkView';
import MarksView from './MarksView';
import NoticesView from './NoticesView';
import CalendarView from './CalendarView';
import TimetableView from './TimetableView';

type TabType = 'overview' | 'attendance' | 'homework' | 'marks' | 'notices' | 'calendar' | 'timetable';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { user } = useAuth();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'attendance', label: 'Attendance', icon: '📊' },
    { id: 'homework', label: 'Homework', icon: '📚' },
    { id: 'marks', label: 'Marks', icon: '📝' },
    { id: 'notices', label: 'Notices', icon: '📄' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'timetable', label: 'Timetable', icon: '🗓️' }
  ];

  const renderOverview = () => {
    return React.createElement('div', null,
      React.createElement('div', { 
        style: { 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }
      },
        React.createElement('div', { 
          style: { 
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
            color: 'white',
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }
        },
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '📊'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Attendance'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'Track your daily attendance and performance'),
          React.createElement('button', {
            onClick: () => setActiveTab('attendance'),
            style: {
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              marginTop: '15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'View Details →')
        ),
        
        React.createElement('div', { 
          style: { 
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', 
            color: 'white',
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }
        },
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '📚'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Homework'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'Check assignments and submit your work'),
          React.createElement('button', {
            onClick: () => setActiveTab('homework'),
            style: {
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              marginTop: '15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'View Details →')
        ),
        
        React.createElement('div', { 
          style: { 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
            color: 'white',
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }
        },
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '📝'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Marks & Grades'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'View your test scores and academic performance'),
          React.createElement('button', {
            onClick: () => setActiveTab('marks'),
            style: {
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              marginTop: '15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'View Details →')
        )
      ),

      React.createElement('div', { 
        style: { 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px'
        }
      },
        React.createElement('div', { 
          style: { 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
            color: 'white',
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }
        },
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '📄'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Notices'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'Important announcements and updates'),
          React.createElement('button', {
            onClick: () => setActiveTab('notices'),
            style: {
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              marginTop: '15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'View Details →')
        ),
        
        React.createElement('div', { 
          style: { 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
            color: 'white',
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }
        },
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '📅'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Calendar'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'Events, holidays, and important dates'),
          React.createElement('button', {
            onClick: () => setActiveTab('calendar'),
            style: {
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              marginTop: '15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'View Details →')
        ),
        
        React.createElement('div', { 
          style: { 
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
            color: 'white',
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }
        },
          React.createElement('div', { style: { fontSize: '28px', marginBottom: '10px' } }, '🗓️'),
          React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Timetable'),
          React.createElement('p', { style: { margin: '0', fontSize: '14px', opacity: '0.9' } }, 'Your class schedule and timing'),
          React.createElement('button', {
            onClick: () => setActiveTab('timetable'),
            style: {
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              marginTop: '15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'View Details →')
        )
      )
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'attendance':
        return React.createElement(AttendanceView);
      case 'homework':
        return React.createElement(HomeworkView);
      case 'marks':
        return React.createElement(MarksView);
      case 'notices':
        return React.createElement(NoticesView);
      case 'calendar':
        return React.createElement(CalendarView);
      case 'timetable':
        return React.createElement(TimetableView);
      default:
        return renderOverview();
    }
  };

  return React.createElement(Layout, { 
    title: 'Student Dashboard', 
    children: React.createElement('div', null,
      React.createElement('div', { 
        style: { 
          background: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }
      },
        React.createElement('div', { 
          style: { 
            padding: '20px 20px 0 20px' 
          }
        },
          React.createElement('h2', { 
            style: { 
              margin: '0 0 20px 0',
              color: '#1f2937'
            }
          }, `Welcome back, ${user?.firstName}!`)
        ),
        
        React.createElement('div', { 
          style: { 
            display: 'flex', 
            overflowX: 'auto',
            borderBottom: '1px solid #e5e7eb',
            paddingLeft: '20px'
          }
        },
          ...tabs.map(tab =>
            React.createElement('button', {
              key: tab.id,
              onClick: () => setActiveTab(tab.id as TabType),
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                borderBottom: `2px solid ${activeTab === tab.id ? '#3b82f6' : 'transparent'}`,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }
            },
              React.createElement('span', { style: { fontSize: '16px' } }, tab.icon),
              tab.label
            )
          )
        )
      ),
      
      React.createElement('div', null, renderTabContent())
    )
  });
};

export default StudentDashboard;