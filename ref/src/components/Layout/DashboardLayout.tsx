import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  UserCheck,
  Bell
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavigationItems = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin-dashboard', icon: Home },
        { name: 'Students', href: '/admin/students', icon: Users },
        { name: 'Teachers', href: '/admin/teachers', icon: UserCheck },
        { name: 'Calendar', href: '/admin/calendar', icon: Calendar },
      ];
    } else if (user?.role === 'teacher') {
      return [
        { name: 'Dashboard', href: '/teacher-dashboard', icon: Home },
        { name: 'Attendance', href: '/teacher/attendance', icon: UserCheck },
        { name: 'Homework', href: '/teacher/homework', icon: BookOpen },
        { name: 'Grades', href: '/teacher/grades', icon: GraduationCap },
        { name: 'Notices', href: '/teacher/notices', icon: Bell },
        { name: 'Calendar', href: '/teacher/calendar', icon: Calendar },
        { name: 'Students', href: '/teacher/students', icon: Users },
      ];
    } else if (user?.role === 'student') {
      return [
        { name: 'Dashboard', href: '/student-dashboard', icon: Home },
        { name: 'Attendance', href: '/student/attendance', icon: UserCheck },
        { name: 'Homework', href: '/student/homework', icon: BookOpen },
        { name: 'Marks', href: '/student/marks', icon: GraduationCap },
        { name: 'Notices', href: '/student/notices', icon: Bell },
        { name: 'Calendar', href: '/student/calendar', icon: Calendar },
        { name: 'Timetable', href: '/student/timetable', icon: Calendar },
      ];
    }
    return [];
  };

  const navigation = getNavigationItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-border">
            <h1 className="text-xl font-bold text-foreground">School Portal</h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-foreground text-sm font-medium">
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome back, {user?.firstName}!
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;