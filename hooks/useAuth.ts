import { useState, useEffect, useCallback } from 'react';

interface User {
  name: string;
  email: string;
}

const FAKE_DB_KEY = 'fakeUserDB';
const SESSION_KEY = 'userSession';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = window.localStorage.getItem(SESSION_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse user session from localStorage", e);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(SESSION_KEY);
      }
    } catch(e) {
      console.error("Failed to save user session to localStorage", e);
    }
  }, [user]);

  const signUpWithEmail = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // In a real app, this would be an API call.
    // Here, we'll simulate a user database in localStorage.
    return new Promise(resolve => {
      setTimeout(() => {
        try {
          const dbString = window.localStorage.getItem(FAKE_DB_KEY);
          const db = dbString ? JSON.parse(dbString) : {};
          if (db[email]) {
            resolve({ success: false, message: 'An account with this email already exists.' });
            return;
          }
          db[email] = { name, email, password }; // Don't store plain passwords in real apps!
          window.localStorage.setItem(FAKE_DB_KEY, JSON.stringify(db));
          
          const newUser = { name, email };
          setUser(newUser);
          resolve({ success: true, message: 'Sign up successful!' });
        } catch (e) {
          console.error(e);
          resolve({ success: false, message: 'An error occurred during sign up.' });
        }
      }, 500);
    });
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // In a real app, this would be an API call.
    return new Promise(resolve => {
      setTimeout(() => {
        try {
          const dbString = window.localStorage.getItem(FAKE_DB_KEY);
          const db = dbString ? JSON.parse(dbString) : {};
          const existingUser = db[email];
          if (!existingUser || existingUser.password !== password) {
             resolve({ success: false, message: 'Invalid email or password.' });
             return;
          }
          
          const loggedInUser = { name: existingUser.name, email: existingUser.email };
          setUser(loggedInUser);
          resolve({ success: true, message: 'Login successful!' });
        } catch(e) {
            console.error(e);
            resolve({ success: false, message: 'An error occurred during login.' });
        }
      }, 500);
    });
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    // This simulates the OAuth popup and response.
     return new Promise(resolve => {
      setTimeout(() => {
        const googleUser = { name: 'Siddhant (Google)', email: 'siddhant@example.com' };
        setUser(googleUser);
        resolve({ success: true, message: 'Login successful!' });
      }, 500);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return { user, signUpWithEmail, loginWithEmail, loginWithGoogle, logout };
};
