import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AttendanceView from './AttendanceView';
import HomeworkView from './HomeworkView';
import MarksView from './MarksView';
import NoticesView from './NoticesView';
import CalendarView from './CalendarView';
import TimetableView from './TimetableView';

type TabType = 'attendance' | 'homework' | 'marks' | 'notices' | 'calendar' | 'timetable';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('attendance');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.firstName || user?.email?.split('@')[0] || 'Student';

  const tabs = [
    { id: 'attendance', label: 'Attendance' },
    { id: 'homework', label: 'Homework' },
    { id: 'marks', label: 'Marks' },
    { id: 'notices', label: 'Notices' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'timetable', label: 'Timetable' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'attendance':
        return <AttendanceView />;
      case 'homework':
        return <HomeworkView />;
      case 'marks':
        return <MarksView />;
      case 'notices':
        return <NoticesView />;
      case 'calendar':
        return <CalendarView />;
      case 'timetable':
        return <TimetableView />;
      default:
        return <AttendanceView />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ backgroundColor: '#333333', color: '#CCCCCC', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Student Dashboard - {displayName}
          </h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#666666',
              color: '#CCCCCC',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === tab.id ? '#555555' : '#444444',
                color: '#CCCCCC',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ backgroundColor: '#444444', padding: '20px', borderRadius: '4px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;