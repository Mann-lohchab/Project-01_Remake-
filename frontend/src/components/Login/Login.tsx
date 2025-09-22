import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { LoginCredentials } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { GraduationCap, UserCheck, Shield, AlertCircle, Loader2 } from 'lucide-react';

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
      let userData;
      switch (userType) {
        case 'student':
          response = await authAPI.studentLogin(credentials);
          userData = {
            ...response.user,
            role: 'student' as const,
            id: credentials.id
          };
          break;
        case 'teacher':
          response = await authAPI.teacherLogin(credentials);
          userData = {
            ...response.user,
            role: 'teacher' as const,
            id: credentials.id
          };
          break;
        case 'admin':
          response = await authAPI.adminLogin(credentials);
          userData = {
            ...response.user,
            role: 'admin' as const,
            id: credentials.id
          };
          break;
      }

      // Login synchronously with sessionStorage
      login(userData, response.token);

      // Navigate immediately since AuthContext handles loading state
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

  const getIcon = () => {
    switch (userType) {
      case 'student':
        return <GraduationCap className="h-8 w-8 text-blue-500" />;
      case 'teacher':
        return <UserCheck className="h-8 w-8 text-emerald-500" />;
      case 'admin':
        return <Shield className="h-8 w-8 text-amber-500" />;
    }
  };

  const getColorScheme = () => {
    switch (userType) {
      case 'student':
        return 'border-blue-200 bg-blue-50/50';
      case 'teacher':
        return 'border-emerald-200 bg-emerald-50/50';
      case 'admin':
        return 'border-amber-200 bg-amber-50/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-warm-950/20 flex items-center justify-center p-4">
      <Card className={`w-full max-w-md ${getColorScheme()}`}>
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
            {getIcon()}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {userType.charAt(0).toUpperCase() + userType.slice(1)} Login
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access your {userType} dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id" className="text-foreground">
                {getIdLabel()}
              </Label>
              <Input
                id="id"
                name="id"
                type="text"
                value={credentials.id}
                onChange={handleInputChange}
                placeholder={`Enter your ${getIdLabel().toLowerCase()}`}
                required
                disabled={loading}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={loading}
                className="bg-background"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {userType === 'student' ? (
                <>
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    Register here
                  </Link>
                </>
              ) : (
                'Contact your administrator for account access'
              )}
            </p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;