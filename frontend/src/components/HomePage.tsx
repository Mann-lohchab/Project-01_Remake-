import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, UserCheck, Shield } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#333333]">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-[#1e293b] rounded-full border-2 border-[#334155]">
              <GraduationCap className="h-20 w-20 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#CCCCCC] mb-6">
            School Portal
          </h1>
          <p className="text-xl text-[#999999] max-w-2xl mx-auto leading-relaxed">
            A comprehensive educational management system designed for students, teachers, and administrators.
            Access your personalized dashboard with ease.
          </p>
        </div>

        {/* Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {/* Student Portal Card */}
          <div className="bg-[#444444] border border-[#555555] rounded-lg p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-[#666666] rounded-full w-fit">
                <Users className="h-12 w-12 text-[#CCCCCC]" />
              </div>
              <h3 className="text-2xl font-bold text-[#CCCCCC] mb-4">Student Portal</h3>
              <p className="text-[#999999] mb-6 leading-relaxed">
                Access your grades, attendance, homework, and more
              </p>
              <Link
                to="/student-login"
                className="inline-block w-full bg-[#666666] hover:bg-[#777777] text-[#CCCCCC] font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Student Login
              </Link>
            </div>
          </div>

          {/* Teacher Portal Card */}
          <div className="bg-[#444444] border border-[#555555] rounded-lg p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-[#666666] rounded-full w-fit">
                <UserCheck className="h-12 w-12 text-[#CCCCCC]" />
              </div>
              <h3 className="text-2xl font-bold text-[#CCCCCC] mb-4">Teacher Portal</h3>
              <p className="text-[#999999] mb-6 leading-relaxed">
                Manage attendance, assignments, and student progress
              </p>
              <Link
                to="/teacher-login"
                className="inline-block w-full bg-[#666666] hover:bg-[#777777] text-[#CCCCCC] font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Teacher Login
              </Link>
            </div>
          </div>

          {/* Admin Portal Card */}
          <div className="bg-[#444444] border border-[#555555] rounded-lg p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-[#666666] rounded-full w-fit">
                <Shield className="h-12 w-12 text-[#CCCCCC]" />
              </div>
              <h3 className="text-2xl font-bold text-[#CCCCCC] mb-4">Admin Portal</h3>
              <p className="text-[#999999] mb-6 leading-relaxed">
                Oversee school operations and manage system settings
              </p>
              <Link
                to="/admin-login"
                className="inline-block w-full bg-[#666666] hover:bg-[#777777] text-[#CCCCCC] font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#CCCCCC] mb-4">Everything You Need</h2>
          <p className="text-[#999999] text-lg max-w-3xl mx-auto leading-relaxed">
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