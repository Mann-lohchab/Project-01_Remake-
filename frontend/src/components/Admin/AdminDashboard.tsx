import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  Search
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import styles from './Dashboard.module.css';

// TypeScript interfaces
interface StatData {
  students: number;
  teachers: number;
  classes: number;
  events: number;
}

interface Student {
  _id?: string;
  studentID: string;
  firstName: string;
  lastName?: string;
  grade: string;
  email: string;
  createdAt?: string;
}

interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: 'new' | 'update' | 'alert' | 'info';
}

interface MetricData {
  averageGPA: number;
  attendanceRate: number;
  passRate: number;
  fullTimeTeachers: number;
  partTimeTeachers: number;
  staffOnLeave: number;
  classrooms: number;
  laboratories: number;
  libraryBooks: number;
}

// Navigation sections data
const navSections = [
  {
    title: 'Main',
    items: [
      {
        label: 'Dashboard',
        icon: BarChart3,
        active: true,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        label: 'Students',
        icon: Users,
      },
      {
        label: 'Teaching Staff',
        icon: UserCheck,
      },
      {
        label: 'Classes',
        icon: BookOpen,
      },
      {
        label: 'Events',
        icon: Calendar,
      },
    ],
  },
  {
    title: 'Analytics',
    items: [
      {
        label: 'Reports',
        icon: BarChart3,
      },
      {
        label: 'Performance',
        icon: BarChart3,
      },
      {
        label: 'Settings',
        icon: BarChart3,
      },
    ],
  },
];

// Stats cards data (will be updated with real data)
const statCards = [
  { key: 'students', label: 'Total Students', value: 0, change: 'Loading...', colorClass: styles.students },
  { key: 'teachers', label: 'Teaching Staff', value: 0, change: 'Loading...', colorClass: styles.teachers },
  { key: 'classes', label: 'Active Classes', value: 0, change: 'Loading...', colorClass: styles.classes },
  { key: 'events', label: 'Upcoming Events', value: 0, change: 'Loading...', colorClass: styles.events },
];

// Default activity feed (will be replaced with real data if available)
const defaultActivityFeed: ActivityItem[] = [
  { id: '1', text: 'Dashboard loaded successfully', time: 'Just now', type: 'info' },
];

// Default bottom metrics (will be replaced with real calculations)
const defaultBottomStats = [
  {
    title: 'Class Performance',
    metrics: [
      { label: 'Average GPA', value: 'N/A' },
      { label: 'Attendance Rate', value: 'N/A' },
      { label: 'Pass Rate', value: 'N/A' },
    ]
  },
  {
    title: 'Staff Overview',
    metrics: [
      { label: 'Full-time Teachers', value: 'N/A' },
      { label: 'Part-time Teachers', value: 'N/A' },
      { label: 'Staff on Leave', value: 'N/A' },
    ]
  },
  {
    title: 'Facilities',
    metrics: [
      { label: 'Classrooms', value: 'N/A' },
      { label: 'Laboratories', value: 'N/A' },
      { label: 'Library Books', value: 'N/A' },
    ]
  },
];

// Status badge mapping
const statusBadge: { [key: string]: string } = {
  Active: `${styles.statusBadge} ${styles.statusActive}`,
  Pending: `${styles.statusBadge} ${styles.statusPending}`,
  Inactive: `${styles.statusBadge} ${styles.statusInactive}`,
};

// Animated counter hook
function useAnimatedCount(target: number, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    let localCount = start;

    const timer = setInterval(() => {
      localCount += increment;
      if (localCount >= target) {
        localCount = target;
        clearInterval(timer);
      }
      setCount(Math.floor(localCount));
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return target > 1000 ? count.toLocaleString() : count.toString();
}

// Main Dashboard component
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeNavIdx, setActiveNavIdx] = useState([0, 0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatData>({
    students: 0,
    teachers: 0,
    classes: 0,
    events: 0
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>(defaultActivityFeed);
  const [metrics, setMetrics] = useState(defaultBottomStats);

  // Temporarily use mock data to allow dashboard to load
  useEffect(() => {
    // Mock data for immediate loading
    const mockStats = {
      students: 1247,
      teachers: 89,
      classes: 42,
      events: 15
    };
    setStats(mockStats);

    // Mock students data
    const mockStudents: Student[] = [
      { _id: '1', studentID: 'STU001', firstName: 'Emma', lastName: 'Johnson', grade: 'Grade 10', email: 'emma.johnson@school.com', createdAt: '2025-09-20' },
      { _id: '2', studentID: 'STU002', firstName: 'Marcus', lastName: 'Chen', grade: 'Grade 9', email: 'marcus.chen@school.com', createdAt: '2025-09-19' },
      { _id: '3', studentID: 'STU003', firstName: 'Sofia', lastName: 'Rodriguez', grade: 'Grade 11', email: 'sofia.rodriguez@school.com', createdAt: '2025-09-18' },
      { _id: '4', studentID: 'STU004', firstName: 'James', lastName: 'Wilson', grade: 'Grade 8', email: 'james.wilson@school.com', createdAt: '2025-09-17' },
      { _id: '5', studentID: 'STU005', firstName: 'Aria', lastName: 'Patel', grade: 'Grade 12', email: 'aria.patel@school.com', createdAt: '2025-09-16' },
      { _id: '6', studentID: 'STU006', firstName: 'David', lastName: 'Kim', grade: 'Grade 10', email: 'david.kim@school.com', createdAt: '2025-09-15' },
    ];
    setStudents(mockStudents);

    // Mock activity feed
    const mockActivities: ActivityItem[] = [
      { id: '1', text: 'New teacher Sarah Mitchell joined Math Department', time: '2 hours ago', type: 'new' },
      { id: '2', text: 'Grade 10 Mathematics exam results published', time: '4 hours ago', type: 'update' },
      { id: '3', text: 'Library maintenance scheduled for tomorrow', time: '6 hours ago', type: 'alert' },
      { id: '4', text: '15 new students enrolled this week', time: '1 day ago', type: 'new' },
      { id: '5', text: 'Parent-teacher conference scheduled for Oct 5', time: '2 days ago', type: 'info' },
      { id: '6', text: 'Science club won regional competition', time: '3 days ago', type: 'new' },
      { id: '7', text: 'New semester timetable updated', time: '4 days ago', type: 'update' },
    ];
    setActivities(mockActivities);

    // Mock metrics
    const mockMetrics = [
      {
        title: 'Class Performance',
        metrics: [
          { label: 'Average GPA', value: '3.7' },
          { label: 'Attendance Rate', value: '94%' },
          { label: 'Pass Rate', value: '89%' },
        ]
      },
      {
        title: 'Staff Overview',
        metrics: [
          { label: 'Full-time Teachers', value: '67' },
          { label: 'Part-time Teachers', value: '22' },
          { label: 'Staff on Leave', value: '3' },
        ]
      },
      {
        title: 'Facilities',
        metrics: [
          { label: 'Classrooms', value: '45' },
          { label: 'Laboratories', value: '8' },
          { label: 'Library Books', value: '15,420' },
        ]
      },
    ];
    setMetrics(mockMetrics);

    setLoading(false);
  }, []);

  // Update stat cards with real data
  const currentStatCards = statCards.map(card => ({
    ...card,
    value: stats[card.key as keyof StatData],
    change: loading ? 'Loading...' : error ? 'Error' : `${stats[card.key as keyof StatData]} total`
  }));

  // Animated stat values
  const statValues = currentStatCards.map(card => useAnimatedCount(card.value));

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  // Handle navigation clicks
  const handleNavClick = (sectionIdx: number, itemIdx: number) => {
    setActiveNavIdx([sectionIdx, itemIdx]);

    // Navigate based on selection
    const section = navSections[sectionIdx];
    const item = section.items[itemIdx];

    switch (item.label) {
      case 'Students':
        navigate('/admin/students');
        break;
      case 'Teaching Staff':
        navigate('/admin/teachers');
        break;
      case 'Classes':
        navigate('/admin/classes');
        break;
      case 'Events':
        navigate('/admin/calendar');
        break;
      case 'Reports':
        navigate('/admin/reports');
        break;
      case 'Performance':
        navigate('/admin/performance');
        break;
      case 'Settings':
        navigate('/admin/settings');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          padding: '20px',
          background: '#2a2a2a',
          borderRadius: '8px',
          color: '#e0e0e0'
        }}>
          Loading dashboard data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          padding: '20px',
          background: '#2a2a2a',
          borderRadius: '8px',
          color: '#ff6b6b',
          border: '1px solid #ff6b6b'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Error Loading Dashboard</h3>
          <p style={{ margin: '0' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              background: '#4FC3F7',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <nav className={styles.sidebar}>
        <div className={styles.logo}>
          <h1>EduAdmin</h1>
        </div>

        {navSections.map((section, sIdx) => (
          <div className={styles.navSection} key={section.title}>
            <div className={styles.navSectionTitle}>{section.title}</div>
            {section.items.map((item, iIdx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.label}
                  className={`${styles.navItem} ${
                    activeNavIdx[0] === sIdx && activeNavIdx[1] === iIdx ? styles.active : ''
                  }`}
                  onClick={() => handleNavClick(sIdx, iIdx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleNavClick(sIdx, iIdx)}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <IconComponent className={styles.navIcon} />
                  {item.label}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Dashboard</h1>
            <p>School Management Overview</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search students, staff, classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search dashboard data"
              />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>A</div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#fff' }}>Admin</div>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>Principal</div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          {currentStatCards.map((card, idx) => (
            <div
              key={card.key}
              className={`${styles.statCard} ${card.colorClass}`}
              role="button"
              tabIndex={0}
              onClick={() => handleNavClick(1, idx)} // Navigate to corresponding management section
              onKeyDown={(e) => e.key === 'Enter' && handleNavClick(1, idx)}
              aria-label={`${card.label}: ${statValues[idx]}`}
            >
              <div className={styles.statNumber}>{statValues[idx]}</div>
              <div className={styles.statLabel}>{card.label}</div>
              <div className={styles.statChange}>{card.change}</div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className={styles.dashboardGrid}>
          {/* Students Table */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Recent Student Enrollments</h3>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => navigate('/admin/students')}
                aria-label="View all students"
              >
                View All Students
              </button>
            </div>
            <div className={styles.panelContent}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Grade</th>
                    <th>Enrollment Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((row) => (
                    <tr key={row._id || row.studentID}>
                      <td>{`${row.firstName} ${row.lastName || ''}`.trim()}</td>
                      <td>{row.grade}</td>
                      <td>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <span className={statusBadge['Active']}>
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Recent Activity</h3>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => navigate('/admin/activities')}
                aria-label="View all activities"
              >
                View All
              </button>
            </div>
            <div className={styles.panelContent}>
              <div className={styles.activityList}>
                {activities.map((item) => (
                  <div className={styles.activityItem} key={item.id}>
                    <div className={`${styles.activityDot} ${styles[`activity${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`]}`}></div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityText}>{item.text}</div>
                      <div className={styles.activityTime}>{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Statistics Grid */}
        <div className={styles.bottomGrid}>
          {metrics.map((stat, idx) => (
            <div className={styles.smallPanel} key={stat.title}>
              <h3>{stat.title}</h3>
              {stat.metrics.map((metric, metricIdx) => (
                <div className={styles.metric} key={metricIdx}>
                  <span className={styles.metricLabel}>{metric.label}</span>
                  <span className={styles.metricValue}>{metric.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;