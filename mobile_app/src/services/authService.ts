import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GoogleLoginResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: Record<string, unknown>;
  isProfileCompleted: boolean;
  clubMemberships: Array<Record<string, unknown>>;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname: string;
  phoneNumber: string;
  city: string;
  district: string;
  motorcycleBrand: string;
  motorcycleModel: string;
  motorcycleCc: number;
  profilePicture: string;
  bloodType: string;
  clothingSize: string;
  driverLicenseType: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  role: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
  isProfileCompleted: boolean;
  clubMemberships: Array<Record<string, unknown>>;
}

interface NotificationSettings {
  pushNotifications?: boolean;
  emailNotifications?: boolean;
  notifyForNewEvents?: boolean;
  notifyForEventUpdates?: boolean;
  // Diğer bildirim ayarları...
}

interface ImageUpload {
  uri: string;
  type: string;
  name: string;
}

class AuthService {
  // Google ile giriş/kayıt
  async loginWithGoogle(idToken: string): Promise<GoogleLoginResponse> {
    try {
      const response = await apiClient.post('/auth/google/login', { idToken });

      // Token ve kullanıcı bilgilerini kaydet
      await AsyncStorage.setItem('auth_token', response.data.token);
      await AsyncStorage.setItem('refresh_token', response.data.refreshToken);
      await AsyncStorage.setItem(
        'user_data',
        JSON.stringify(response.data.user),
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcı profili alma
  async getUserProfile(): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.get('/auth/me');
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Profil bilgilerini güncelleme
  async updateProfile(
    profileData: Partial<UserProfileResponse>,
  ): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.patch('/auth/me', profileData);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Profil fotoğrafını güncelleme
  async updateProfilePicture(
    pictureUri: string,
  ): Promise<{ profilePicture: string }> {
    try {
      const formData = new FormData();
      formData.append('profilePicture', {
        uri: pictureUri,
        type: 'image/jpeg',
        name: 'profile-picture.jpg',
      } as ImageUpload);

      const response = await apiClient.post(
        '/auth/me/profile-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // Önbelleğe alınmış kullanıcı verilerini güncelle
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        parsedUserData.profilePicture = response.data.profilePicture;
        await AsyncStorage.setItem('user_data', JSON.stringify(parsedUserData));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Bildirim ayarlarını güncelleme
  async updateNotificationSettings(
    settings: NotificationSettings,
  ): Promise<NotificationSettings> {
    try {
      const response = await apiClient.patch(
        '/auth/me/notification-settings',
        settings,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // OneSignal ID güncelleme
  async updateOneSignalPlayerId(
    playerId: string,
  ): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.put('/auth/me/onesignal-id', {
        oneSignalPlayerId: playerId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Çıkış
  async logout(): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post('/auth/logout');
      await AsyncStorage.multiRemove([
        'auth_token',
        'refresh_token',
        'user_data',
      ]);
      return response.data;
    } catch (error) {
      // Yerel depolama temizliğini yine de yap
      await AsyncStorage.multiRemove([
        'auth_token',
        'refresh_token',
        'user_data',
      ]);
      throw error;
    }
  }

  // Kullanıcının giriş yapmış olup olmadığını kontrol et
  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // Profil tamamlama
  async completeProfile(
    profileData: Partial<UserProfileResponse>,
  ): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.patch(
        '/profile-completion/complete',
        profileData,
      );
      await AsyncStorage.setItem(
        'user_data',
        JSON.stringify(response.data.user),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
