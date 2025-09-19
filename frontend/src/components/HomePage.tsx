import React from 'react';

const HomePage: React.FC = () => {
  return React.createElement('div', { 
    style: { 
      textAlign: 'center', 
      padding: '60px 20px', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }
  },
    React.createElement('h1', { 
      style: { 
        fontSize: '48px', 
        marginBottom: '20px', 
        color: '#333' 
      } 
    }, 'Student Portal'),
    
    React.createElement('p', { 
      style: { 
        fontSize: '18px', 
        marginBottom: '40px', 
        color: '#666' 
      } 
    }, 'Welcome to the Student Portal. Please select your login type:'),
    
    React.createElement('div', { 
      style: { 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'center', 
        flexWrap: 'wrap' 
      } 
    },
      React.createElement('a', {
        href: '/student-login',
        style: {
          display: 'inline-block',
          padding: '15px 30px',
          background: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'background-color 0.2s ease'
        }
      }, 'Student Login'),
      
      React.createElement('a', {
        href: '/teacher-login',
        style: {
          display: 'inline-block',
          padding: '15px 30px',
          background: '#10b981',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'background-color 0.2s ease'
        }
      }, 'Teacher Login'),
      
      React.createElement('a', {
        href: '/admin-login',
        style: {
          display: 'inline-block',
          padding: '15px 30px',
          background: '#f59e0b',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'background-color 0.2s ease'
        }
      }, 'Admin Login')
    )
  );
};

export default HomePage;