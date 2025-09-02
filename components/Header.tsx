import React, { useState, FormEvent } from 'react';
import { TargetIcon, SunIcon, MoonIcon, UserIcon, LogOutIcon, GoogleIcon } from './icons';

// Define the User type to be used in props
interface User {
  name: string;
  email: string;
}

// Props for the auth functions
interface AuthFunctions {
  signUpWithEmail: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

interface HeaderProps extends AuthFunctions {
  theme: string;
  toggleTheme: () => void;
  user: User | null;
}

type ModalView = 'main' | 'email-signin' | 'email-signup';

// --- Login Modal Component ---
const LoginModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  auth: AuthFunctions;
}> = ({ isOpen, onClose, auth }) => {
  const [view, setView] = useState<ModalView>('main');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    setView('main');
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation for a better user experience
    if ((view === 'email-signup' && !name.trim()) || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (view === 'email-signup' && password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    let result;
    if (view === 'email-signup') {
      result = await auth.signUpWithEmail(name, email, password);
    } else {
      result = await auth.loginWithEmail(email, password);
    }

    setIsLoading(false);
    if (result.success) {
      handleClose();
    } else {
      setError(result.message);
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    const result = await auth.loginWithGoogle();
     setIsLoading(false);
    if (result.success) {
      handleClose();
    } else {
      setError(result.message);
    }
  };

  const renderMainView = () => (
    <>
      <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100 mb-6">Welcome Back</h2>
      <div className="space-y-4">
        <button onClick={handleGoogleLogin} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors disabled:opacity-50">
          <GoogleIcon className="h-5 w-5" />
          Sign in with Google
        </button>
        <button onClick={() => setView('email-signin')} disabled={isLoading} className="w-full px-4 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50">
          Sign in with Email
        </button>
      </div>
       <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-6">
          Don't have an account?{' '}
          <button onClick={() => setView('email-signup')} className="font-semibold text-cyan-500 hover:underline">
            Sign up
          </button>
        </p>
    </>
  );

  const renderEmailForm = (isSignUp: boolean) => (
    <>
      <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100 mb-6">
        {isSignUp ? 'Create an Account' : 'Sign In'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button type="submit" disabled={isLoading} className="w-full px-4 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50">
          {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>
      </form>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-6">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button onClick={() => setView(isSignUp ? 'email-signin' : 'email-signup')} className="font-semibold text-cyan-500 hover:underline">
          {isSignUp ? 'Sign in' : 'Sign up'}
        </button>
      </p>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm p-8" onClick={e => e.stopPropagation()}>
        {view === 'main' && renderMainView()}
        {view === 'email-signin' && renderEmailForm(false)}
        {view === 'email-signup' && renderEmailForm(true)}
      </div>
    </div>
  );
};


// --- Header Component ---
export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, user, ...authProps }) => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

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
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                  <span className="font-semibold text-sm hidden sm:block">{user.name}</span>
                </div>
                <button onClick={authProps.logout} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Logout">
                  <LogOutIcon className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <button onClick={() => setLoginModalOpen(true)} className="px-4 py-2 bg-cyan-500 text-white text-sm font-semibold rounded-lg hover:bg-cyan-600 transition-colors">
                Login
              </button>
            )}
          </div>
        </div>
      </header>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        auth={authProps} 
      />
    </>
  );
};