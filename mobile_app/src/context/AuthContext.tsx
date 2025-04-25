import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!token);
      if (token) {
        // Burada gerçek API çağrısı yapılacak
        setUser({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '555-1234',
          bio: 'I am a developer',
        });
      }
    } catch (error) {
      console.error('Kimlik doğrulama durumu kontrol edilirken hata:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Burada gerçek API çağrısı yapılacak
      await AsyncStorage.setItem('userToken', 'dummy-token');
      setIsAuthenticated(true);
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        bio: 'I am a developer',
      });
    } catch (error) {
      console.error('Giriş yapılırken hata:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      // Burada gerçek API çağrısı yapılacak
      await AsyncStorage.setItem('userToken', 'dummy-token');
      setIsAuthenticated(true);
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        bio: 'I am a developer',
      });
    } catch (error) {
      console.error('Kayıt olunurken hata:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      // Burada gerçek API çağrısı yapılacak
      setUser({
        ...user!,
        ...data,
      });
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{isAuthenticated, user, login, register, logout, updateProfile}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
