import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContext as IAuthContext } from '@/types/auth';
import { demoUsers } from '@/data/mockData';

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const REGISTERED_USERS_KEY = 'healthbridge_registered_users';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Synchronous state initialization ensures zero flash of unauthenticated state on page refresh
  const [user, setUser] = useState<User | null>(() => {
    try {
      if (typeof window === 'undefined') return null;
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const getAllUsers = (): User[] => {
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      const registered: User[] = stored ? JSON.parse(stored) : [];
      return [...demoUsers, ...registered];
    } catch {
      return demoUsers;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate brief network verification delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allUsers = getAllUsers();
    const foundUser = allUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (foundUser) {
      const sanitizedUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        avatar: foundUser.avatar,
        specialization: foundUser.specialization,
        location: foundUser.location,
        phone: foundUser.phone
      };
      setUser(sanitizedUser);
      localStorage.setItem('user', JSON.stringify(sanitizedUser));
      return true;
    }
    return false;
  };

  const register = async (data: { 
    name: string; 
    email: string; 
    password: string; 
    role?: User['role']; 
    phone?: string; 
    location?: string 
  }): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const allUsers = getAllUsers();
    
    // Check if email already registered
    if (allUsers.some(u => u.email.toLowerCase() === data.email.toLowerCase().trim())) {
      throw new Error('An account with this email address already exists.');
    }

    // Role safety: Public registration is restricted to patients (or pharmacy upon verification)
    const assignedRole = data.role && data.role !== 'admin' ? data.role : 'patient';

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password,
      role: assignedRole,
      phone: data.phone || '+91 9800000000',
      location: data.location || 'Nabha, Punjab'
    };

    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      const registered: User[] = stored ? JSON.parse(stored) : [];
      registered.push(newUser);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));

      // Automatically sign in the newly registered user
      const sanitizedUser: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        location: newUser.location,
        phone: newUser.phone
      };
      setUser(sanitizedUser);
      localStorage.setItem('user', JSON.stringify(sanitizedUser));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
