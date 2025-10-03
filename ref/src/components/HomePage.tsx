import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, UserCheck, Shield } from 'lucide-react';
import '../styles/theme.css';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen theme-bg-primary">
      {/* Header Section */}
      <div className="theme-container theme-section-spacing">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="p-6 theme-icon-container rounded-full">
              <GraduationCap className="h-20 w-20 theme-text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold theme-text-primary mb-6">
            School Portal
          </h1>
          <p className="text-xl theme-text-light max-w-2xl mx-auto leading-relaxed">
            A comprehensive educational management system designed for students, teachers, and administrators.
            Access your personalized dashboard with ease.
          </p>
        </div>

        {/* Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {/* Student Portal Card */}
          <div className="theme-card p-8">
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 theme-bg-secondary rounded-full w-fit">
                <Users className="h-12 w-12 theme-text-tertiary" />
              </div>
              <h3 className="text-2xl font-bold theme-text-secondary mb-4">Student Portal</h3>
              <p className="theme-text-light mb-6 leading-relaxed">
                Access your grades, attendance, homework, and more
              </p>
              <Link
                to="/student-login"
                className="inline-block w-full theme-btn-secondary font-semibold py-3 px-6 rounded-lg"
              >
                Student Login
              </Link>
            </div>
          </div>

          {/* Teacher Portal Card */}
          <div className="theme-card p-8">
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 theme-bg-secondary rounded-full w-fit">
                <UserCheck className="h-12 w-12 theme-text-tertiary" />
              </div>
              <h3 className="text-2xl font-bold theme-text-secondary mb-4">Teacher Portal</h3>
              <p className="theme-text-light mb-6 leading-relaxed">
                Manage attendance, assignments, and student progress
              </p>
              <Link
                to="/teacher-login"
                className="inline-block w-full theme-btn-secondary font-semibold py-3 px-6 rounded-lg"
              >
                Teacher Login
              </Link>
            </div>
          </div>

          {/* Admin Portal Card */}
          <div className="theme-card p-8">
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 theme-bg-secondary rounded-full w-fit">
                <Shield className="h-12 w-12 theme-text-tertiary" />
              </div>
              <h3 className="text-2xl font-bold theme-text-secondary mb-4">Admin Portal</h3>
              <p className="theme-text-light mb-6 leading-relaxed">
                Oversee school operations and manage system settings
              </p>
              <Link
                to="/admin-login"
                className="inline-block w-full theme-btn-secondary font-semibold py-3 px-6 rounded-lg"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold theme-text-primary mb-4">Everything You Need</h2>
          <p className="theme-text-light text-lg max-w-3xl mx-auto leading-relaxed">
            Our comprehensive school portal provides all the tools necessary for modern education management.
            From attendance tracking to grade management, we ensure seamless communication between students,
            teachers, and administrators for a better learning experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;