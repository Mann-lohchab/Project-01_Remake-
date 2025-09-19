import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { LoginCredentials } from '../../types';
import './Login.css';

interface LoginProps {
  userType: 'student' | 'teacher' | 'admin';
}

const Login: React.FC<LoginProps> = ({ userType }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ id: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      switch (userType) {
        case 'student':
          response = await authAPI.studentLogin(credentials);
          login({
            ...response.user,
            role: 'student',
            id: credentials.id
          }, response.token);
          break;
        case 'teacher':
          response = await authAPI.teacherLogin(credentials);
          login({
            ...response.user,
            role: 'teacher',
            id: credentials.id
          }, response.token);
          break;
        case 'admin':
          response = await authAPI.adminLogin(credentials);
          login({
            ...response.user,
            role: 'admin',
            id: credentials.id
          }, response.token);
          break;
      }

      navigate(`/${userType}-dashboard`);
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const getIdLabel = () => {
    switch (userType) {
      case 'student':
        return 'Student ID';
      case 'teacher':
        return 'Teacher ID';
      case 'admin':
        return 'Admin ID';
    }
  };

  return React.createElement('div', { className: 'login-container' },
    React.createElement('div', { className: 'login-card' },
      React.createElement('h2', { className: 'login-title' }, 
        userType.charAt(0).toUpperCase() + userType.slice(1) + ' Login'
      ),
      
      error && React.createElement('div', { className: 'error-message' }, error),
      
      React.createElement('form', { onSubmit: handleSubmit, className: 'login-form' },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'id', className: 'form-label' }, getIdLabel()),
          React.createElement('input', {
            type: 'text',
            id: 'id',
            name: 'id',
            value: credentials.id,
            onChange: handleInputChange,
            className: 'form-input',
            placeholder: `Enter your ${getIdLabel().toLowerCase()}`,
            required: true
          })
        ),

        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'password', className: 'form-label' }, 'Password'),
          React.createElement('input', {
            type: 'password',
            id: 'password',
            name: 'password',
            value: credentials.password,
            onChange: handleInputChange,
            className: 'form-input',
            placeholder: 'Enter your password',
            required: true
          })
        ),

        React.createElement('button', {
          type: 'submit',
          disabled: loading,
          className: 'login-button'
        }, loading ? 'Logging in...' : 'Login')
      ),

      React.createElement('div', { className: 'login-links' },
        React.createElement('p', null, 'Don\'t have an account?'),
        userType === 'student' && React.createElement('a', {
          href: '/register',
          className: 'link'
        },)
      )
    )
  );
};

export default Login;