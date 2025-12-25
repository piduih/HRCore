import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
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
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Visual & Trust (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-neutral-900 opacity-90 z-10"></div>
        <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Office background" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-30"
        />
        
        <div className="relative z-20">
            <div className="flex items-center gap-2 text-white mb-8">
                <Icon name="cube" className="w-8 h-8 text-primary-400" />
                <span className="text-2xl font-bold tracking-tight">HR Core</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
                Urus pasukan anda dengan <br />
                <span className="text-primary-400">keyakinan penuh.</span>
            </h2>
            <p className="text-neutral-400 text-lg max-w-md">
                Sertai ribuan pengurus yang telah beralih ke sistem digital untuk kecekapan maksimum.
            </p>
        </div>

        <div className="relative z-20">
            <div className="flex items-center gap-4 mb-4">
                 <div className="flex -space-x-4">
                    <img className="w-10 h-10 rounded-full border-2 border-neutral-900" src="https://i.pravatar.cc/100?img=1" alt="" />
                    <img className="w-10 h-10 rounded-full border-2 border-neutral-900" src="https://i.pravatar.cc/100?img=2" alt="" />
                    <img className="w-10 h-10 rounded-full border-2 border-neutral-900" src="https://i.pravatar.cc/100?img=3" alt="" />
                </div>
                <div className="text-white">
                    <p className="font-bold">500+ Syarikat</p>
                    <p className="text-xs text-neutral-400">Mempercayai kami</p>
                </div>
            </div>
             <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} HR Core System. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <button onClick={onBack} className="absolute top-8 left-8 text-neutral-500 hover:text-neutral-900 flex items-center gap-2 transition-colors">
            <Icon name="arrow-left" className="w-4 h-4" /> {/* Assuming arrow-left needs to be added or use chevron */}
            Kembali
        </button>

        <div className="w-full max-w-sm space-y-8">
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-neutral-900">Selamat Kembali</h2>
                <p className="mt-2 text-neutral-600">Sila log masuk ke akaun anda.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Emel Kerja</label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-3 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                            placeholder="nama@syarikat.com"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                         <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Kata Laluan</label>
                         <div className="text-sm">
                            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Lupa kata laluan?</a>
                        </div>
                    </div>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-3 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-900">
                        Ingat saya
                    </label>
                </div>

                <div>
                    <Button type="submit" className="w-full justify-center py-3 text-base shadow-lg shadow-primary-500/20" disabled={isLoading}>
                        {isLoading ? 'Sedang Log Masuk...' : 'Log Masuk'}
                    </Button>
                </div>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-neutral-500">Atau akses demo</span>
                </div>
            </div>

            <button
                onClick={handleDemoLogin}
                className="w-full flex justify-center items-center px-4 py-3 border border-neutral-300 shadow-sm text-sm font-medium rounded-lg text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
            >
                <Icon name="user-circle" className="w-5 h-5 mr-2 text-neutral-500" />
                Log Masuk Akaun Demo
            </button>
        </div>
      </div>
    </div>
  );
};
