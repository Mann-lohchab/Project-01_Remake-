import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  Search,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Settings,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import styles from './Dashboard.module.css';
import '../../styles/theme.css';

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
        label: 'Teachers',
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
        icon: Settings,
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

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}

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
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState<StatData>({
    students: 0,
    teachers: 0,
    classes: 0,
    events: 0
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>(defaultActivityFeed);
  const [metrics, setMetrics] = useState(defaultBottomStats);
  const [activityFilter, setActivityFilter] = useState<'all' | 'CREATE' | 'UPDATE' | 'DELETE'>('all');
  const [activitySort, setActivitySort] = useState<'newest' | 'oldest'>('newest');

  // Fetch real data from APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data concurrently
        const [studentsData, teachersData, classesData, eventsData, auditData] = await Promise.all([
          adminAPI.getStudents(),
          adminAPI.getTeachers(),
          adminAPI.getClasses(),
          adminAPI.getCalendarEvents(),
          adminAPI.getAuditLogs({ limit: 20, sortBy: 'timestamp', sortOrder: 'desc' }).catch(() => ({ logs: [] })) // Fallback if audit API fails
        ]);

        // Update stats with real counts
        const realStats = {
          students: studentsData.length,
          teachers: teachersData.length,
          classes: classesData.length,
          events: eventsData.length
        };
        setStats(realStats);

        // Set students data (take first 6 for display, sorted by creation date)
        const sortedStudents = studentsData
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6)
          .map((student: any) => ({
            _id: student._id,
            studentID: student.studentID,
            firstName: student.firstName,
            lastName: student.lastName || '',
            grade: `Grade ${student.grade}`,
            email: student.email,
            createdAt: student.createdAt
          }));
        setStudents(sortedStudents);

        // Process real audit logs for activity feed
        const realActivities: ActivityItem[] = auditData.logs.slice(0, 10).map((log: any) => {
          const timeAgo = getTimeAgo(new Date(log.timestamp));
          let type: 'new' | 'update' | 'alert' | 'info' = 'info';

          switch (log.action) {
            case 'CREATE':
              type = 'new';
              break;
            case 'UPDATE':
              type = 'update';
              break;
            case 'DELETE':
              type = 'alert';
              break;
            default:
              type = 'info';
          }

          return {
            id: log._id,
            text: log.description,
            time: timeAgo,
            type
          };
        });

        // If no audit logs, show some default activities
        if (realActivities.length === 0) {
          realActivities.push(
            { id: '1', text: 'Dashboard loaded successfully', time: 'Just now', type: 'info' },
            { id: '2', text: `${studentsData.length} students enrolled this week`, time: '1 day ago', type: 'new' },
            { id: '3', text: `${teachersData.length} teachers currently active`, time: '2 days ago', type: 'info' }
          );
        }

        setActivities(realActivities);

        // Calculate dynamic metrics based on real data
        const fullTimeTeachers = teachersData.filter((teacher: any) => !teacher.partTime).length;
        const partTimeTeachers = teachersData.filter((teacher: any) => teacher.partTime).length;

        const dynamicMetrics = [
          {
            title: 'Class Performance',
            metrics: [
              { label: 'Average GPA', value: 'N/A' }, // Would need marks data
              { label: 'Attendance Rate', value: 'N/A' }, // Would need attendance data
              { label: 'Pass Rate', value: 'N/A' }, // Would need marks data
            ]
          },
          {
            title: 'Staff Overview',
            metrics: [
              { label: 'Full-time Teachers', value: fullTimeTeachers.toString() },
              { label: 'Part-time Teachers', value: partTimeTeachers.toString() },
              { label: 'Total Staff', value: teachersData.length.toString() },
            ]
          },
          {
            title: 'Academic Overview',
            metrics: [
              { label: 'Total Classes', value: classesData.length.toString() },
              { label: 'Total Students', value: studentsData.length.toString() },
              { label: 'Upcoming Events', value: eventsData.length.toString() },
            ]
          },
        ];
        setMetrics(dynamicMetrics);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  // Route mapping for navigation
  const routeMapping: { [key: string]: string } = {
    'Students': '/admin/students',
    'Teachers': '/admin/teachers',
    'Classes': '/admin/classes',
    'Events': '/admin/calendar',
    'Reports': '/admin/reports',
    'Performance': '/admin/performance',
    'Settings': '/admin/settings',
  };

  // Handle navigation clicks
  const handleNavClick = (sectionIdx: number, itemIdx: number) => {
    setActiveNavIdx([sectionIdx, itemIdx]);

    // Navigate based on selection
    const section = navSections[sectionIdx];
    const item = section.items[itemIdx];
    const route = routeMapping[item.label];

    if (route) {
      navigate(route);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear authentication data
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');

      // Navigate to home page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local data and redirect
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/', { replace: true });
    }
  };

  // Handle user dropdown toggle
  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

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
      <nav className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.logo}>
          <div className={styles.logoContent}>
            <h1>EduAdmin</h1>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={styles.collapseBtn}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>
        </div>

        {navSections.map((section, sIdx) => (
          <div className={styles.navSection} key={section.title}>
            {!sidebarCollapsed && (
              <div className={styles.navSectionTitle}>{section.title}</div>
            )}
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
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <IconComponent className={styles.navIcon} />
                  {!sidebarCollapsed && item.label}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Main Content */}
      <main className={`${styles.mainContent} ${sidebarCollapsed ? styles.mainContentExpanded : ''}`}>
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
            <div className="user-dropdown-container relative">
              <div
                className={`${styles.userInfo} cursor-pointer`}
                onClick={toggleUserDropdown}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleUserDropdown()}
                aria-label="User menu"
              >
                <div className={styles.userAvatar}>P</div>
                <div className="flex items-center gap-1">
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#fff' }}>Admin</div>
                    <div style={{ fontSize: '0.7rem', color: '#888' }}>Principal</div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`}
                    style={{ color: '#888' }}
                  />
                </div>
              </div>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-[#e0e0e0] hover:bg-red-500 hover:text-white transition-colors duration-150 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
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
              <h3 className={styles.panelTitle}>Recent Enrollments</h3>
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
              <div className={styles.activityControls}>
                <div className={styles.filterGroup}>
                  <Filter size={16} />
                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value as any)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Actions</option>
                    <option value="CREATE">Creations</option>
                    <option value="UPDATE">Updates</option>
                    <option value="DELETE">Deletions</option>
                  </select>
                </div>
                <div className={styles.sortGroup}>
                  {activitySort === 'newest' ? <SortDesc size={16} /> : <SortAsc size={16} />}
                  <select
                    value={activitySort}
                    onChange={(e) => setActivitySort(e.target.value as 'newest' | 'oldest')}
                    className={styles.filterSelect}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
                <button
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => navigate('/admin/activities')}
                  aria-label="View all activities"
                >
                  View All
                </button>
              </div>
            </div>
            <div className={styles.panelContent}>
              <div className={styles.activityList}>
                {activities
                  .filter(activity => activityFilter === 'all' || activity.type.toUpperCase() === activityFilter ||
                    (activityFilter === 'CREATE' && activity.type === 'new') ||
                    (activityFilter === 'UPDATE' && activity.type === 'update') ||
                    (activityFilter === 'DELETE' && activity.type === 'alert'))
                  .sort((a, b) => {
                    if (activitySort === 'newest') return 0; // Already sorted by API
                    return 0; // Keep API order for now
                  })
                  .map((item) => (
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