import React, { useState } from 'react';
import { TargetIcon, SunIcon, MoonIcon, UserIcon, LogOutIcon, GoogleIcon } from './icons';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  user: { name: string };
  onLogin: () => void;
  onLogout: () => void;
}

const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onLogin: () => void; }> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm p-8" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100 mb-6">Welcome Back</h2>
        <div className="space-y-4">
          <button onClick={onLogin} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
            <GoogleIcon className="h-5 w-5" />
            Sign in with Google
          </button>
           <button onClick={onLogin} className="w-full px-4 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors">
            Sign in with Email
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-6">
          Sign in to save your progress in the cloud.
        </p>
      </div>
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, isLoggedIn, user, onLogin, onLogout }) => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };
  
  const handleLoginSuccess = () => {
    onLogin();
    setLoginModalOpen(false);
  };

  return (
    <>
      <header className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <TargetIcon className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
            <h1 className="ml-3 text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              SSC Syllabus Tracker
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Toggle theme">
              {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                  <span className="font-semibold text-sm hidden sm:block">{user.name}</span>
                </div>
                <button onClick={onLogout} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Logout">
                  <LogOutIcon className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <button onClick={handleLoginClick} className="px-4 py-2 bg-cyan-500 text-white text-sm font-semibold rounded-lg hover:bg-cyan-600 transition-colors">
                Login
              </button>
            )}
          </div>
        </div>
      </header>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} onLogin={handleLoginSuccess} />
    </>
  );
};