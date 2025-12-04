
import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin();
    }, 800);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decoration - Extended height to ensure white text is visible */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary transform -skew-y-3 origin-top-left z-0"></div>
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white text-primary shadow-lg mb-4">
                <Icon name="cube" className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white">HR Core</h1>
            <p className="text-white mt-2 font-medium">Sistem Pengurusan Sumber Manusia</p>
        </div>

        <Card className="p-8 shadow-xl border-t-4 border-primary">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="user" className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-neutral-300 rounded-md py-2.5"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="settings" className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-neutral-300 rounded-md py-2.5"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-700">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full justify-center py-2.5" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">
                  Or try the demo
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full flex justify-center items-center px-4 py-2.5 border border-primary shadow-sm text-sm font-medium rounded-md text-primary bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                <Icon name="user-circle" className="w-5 h-5 mr-2" />
                Login to Demo Account
              </button>
              <p className="mt-2 text-xs text-center text-neutral-500">
                Access as Admin/Manager to view all features.
              </p>
            </div>
          </div>
        </Card>
        
        <p className="mt-8 text-center text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} HR Core System. All rights reserved.
        </p>
      </div>
    </div>
  );
};
