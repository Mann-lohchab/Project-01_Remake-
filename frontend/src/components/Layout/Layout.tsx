import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

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

  return React.createElement('div', { className: 'layout' },
    React.createElement('header', { className: 'layout-header' },
      React.createElement('div', { className: 'header-content' },
        React.createElement('h1', { className: 'header-title' },
          title || 'Student Portal'
        ),
        React.createElement('div', { className: 'header-user' },
          React.createElement('span', { className: 'user-name' },
            `Welcome, ${user?.firstName} ${user?.lastName || ''}`
          ),
          React.createElement('button', {
            onClick: handleLogout,
            className: 'logout-button'
          }, 'Logout')
        )
      )
    ),
    React.createElement('main', { className: 'layout-main' }, children)
  );
};

export default Layout;