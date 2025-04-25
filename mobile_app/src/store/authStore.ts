import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services';
import { SetState } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  phoneNumber?: string;
  city?: string;
  district?: string;
  motorcycleBrand?: string;
  motorcycleModel?: string;
  motorcycleCc?: number;
  profilePicture?: string;
  bloodType?: string;
  clothingSize?: string;
  driverLicenseType?: string;
  role: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
  isProfileCompleted: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  error: string | null;

  // Eylemler
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set: SetState<AuthState>) => ({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
  error: null,

  // Google ile giriş
  loginWithGoogle: async (idToken: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.loginWithGoogle(idToken);

      set({
        isAuthenticated: true,
        user: response.user as unknown as User,
        token: response.token,
        isLoading: false,
      });
    } catch (error: unknown) {
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      });
    }
  },

  // Çıkış
  logout: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      });
    } catch (error: unknown) {
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      });
    }
  },

  // Kullanıcı profili alma
  getUserProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = await authService.getUserProfile();
      set({ user, isLoading: false });
    } catch (error: unknown) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Profil bilgileri alınamadı',
      });
    }
  },

  // Profil güncelleme
  updateProfile: async (profileData: Partial<User>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedUser = await authService.updateProfile(profileData);
      set({ user: updatedUser, isLoading: false });
    } catch (error: unknown) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Profil güncellenemedi',
      });
    }
  },

  // Hata temizleme
  clearError: () => set({ error: null }),

  // İlk yükleme
  initialize: async () => {
    try {
      set({ isLoading: true });

      // Depolanan token ve kullanıcı verilerini al
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');

      if (token && userData) {
        set({
          isAuthenticated: true,
          token,
          user: JSON.parse(userData),
          isLoading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
          isLoading: false,
        });
      }
    } catch (error: unknown) {
      set({
        isAuthenticated: false,
        token: null,
        user: null,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;
