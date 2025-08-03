import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateProfile: (updates: { name?: string; email?: string; phone?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Initialize default admin user
const initializeDefaultAdmin = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const adminExists = users.find((user: User) => user.email === 'admin@store.com');
  
  if (!adminExists) {
    const defaultAdmin = {
      id: 'admin-001',
      email: 'admin@store.com',
      name: 'Store Administrator',
      role: 'admin' as const,
      phone: '+977 98765 43210',
      password: bcrypt.hashSync('admin123', 10)
    };
    users.push(defaultAdmin);
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize default admin
    initializeDefaultAdmin();
    
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        setIsLoading(false);
        return false;
      }
      
      const isValidPassword = bcrypt.compareSync(password, user.password);
      
      if (!isValidPassword) {
        setIsLoading(false);
        return false;
      }
      
      const userSession = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone
      };
      
      setUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser) {
        setIsLoading(false);
        return false;
      }
      
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        role: 'customer' as const,
        password: bcrypt.hashSync(password, 10)
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      const userSession = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      };
      
      setUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) return false;
      
      const isValidPassword = bcrypt.compareSync(currentPassword, users[userIndex].password);
      
      if (!isValidPassword) return false;
      
      users[userIndex].password = bcrypt.hashSync(newPassword, 10);
      localStorage.setItem('users', JSON.stringify(users));
      
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  };

  const updateProfile = async (updates: { name?: string; email?: string; phone?: string }): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) return false;
      
      // Check if email is being changed and if it already exists
      if (updates.email && updates.email !== user.email) {
        const emailExists = users.find((u: any) => u.email === updates.email && u.id !== user.id);
        if (emailExists) return false;
      }
      
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
      
      const updatedUser = {
        id: users[userIndex].id,
        email: users[userIndex].email,
        name: users[userIndex].name,
        role: users[userIndex].role,
        phone: users[userIndex].phone
      };
      
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    changePassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};