import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return React.createElement('div', { className: 'min-h-screen bg-gray-50' },
    React.createElement('header', { className: 'bg-white border-b border-gray-200 px-5' },
      React.createElement('div', { className: 'max-w-7xl mx-auto flex justify-between items-center h-15' },
        React.createElement('h1', { className: 'text-gray-900 text-xl font-bold m-0' },
          title || 'Student Portal'
        ),
        React.createElement('div', { className: 'flex items-center gap-4' },
          React.createElement('span', { className: 'text-gray-700 font-medium' },
            `Welcome, ${user?.firstName} ${user?.lastName || ''}`
          ),
          React.createElement('button', {
            onClick: handleLogout,
            className: 'bg-red-500 text-white border-none px-4 py-2 rounded cursor-pointer text-sm font-medium transition-colors duration-200 hover:bg-red-600'
          }, 'Logout')
        )
      )
    ),
    React.createElement('main', { className: 'max-w-7xl mx-auto p-5' }, children)
  );
};

export default Layout;