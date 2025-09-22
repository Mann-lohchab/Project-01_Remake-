import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { LoginCredentials } from '../../types';

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

  return React.createElement('div', { className: 'flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-5' },
    React.createElement('div', { className: 'bg-white rounded-lg shadow-lg p-10 w-full max-w-md' },
      React.createElement('h2', { className: 'text-center mb-8 text-gray-800 text-2xl font-semibold' },
        userType.charAt(0).toUpperCase() + userType.slice(1) + ' Login'
      ),

      error && React.createElement('div', { className: 'bg-red-50 text-red-600 p-3 rounded mb-5 text-center text-sm' }, error),

      React.createElement('form', { onSubmit: handleSubmit, className: 'flex flex-col gap-5' },
        React.createElement('div', { className: 'flex flex-col' },
          React.createElement('label', { htmlFor: 'id', className: 'mb-2 text-gray-700 font-medium' }, getIdLabel()),
          React.createElement('input', {
            type: 'text',
            id: 'id',
            name: 'id',
            value: credentials.id,
            onChange: handleInputChange,
            className: 'p-3 border border-gray-300 rounded text-base transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10',
            placeholder: `Enter your ${getIdLabel().toLowerCase()}`,
            required: true
          })
        ),

        React.createElement('div', { className: 'flex flex-col' },
          React.createElement('label', { htmlFor: 'password', className: 'mb-2 text-gray-700 font-medium' }, 'Password'),
          React.createElement('input', {
            type: 'password',
            id: 'password',
            name: 'password',
            value: credentials.password,
            onChange: handleInputChange,
            className: 'p-3 border border-gray-300 rounded text-base transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10',
            placeholder: 'Enter your password',
            required: true
          })
        ),

        React.createElement('button', {
          type: 'submit',
          disabled: loading,
          className: 'bg-blue-500 text-white p-3 border-none rounded text-base font-semibold cursor-pointer transition-colors mt-3 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
        }, loading ? 'Logging in...' : 'Login')
      ),

      React.createElement('div', { className: 'text-center mt-5' },
        React.createElement('p', { className: 'text-gray-500 mb-3' }, 'Don\'t have an account?'),
        userType === 'student' && React.createElement('a', {
          href: '/register',
          className: 'text-blue-500 no-underline font-medium hover:underline'
        },)
      )
    )
  );
};

export default Login;