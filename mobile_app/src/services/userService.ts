import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Kulüp üyeliği türü
export interface ClubMembership {
  clubId: string;
  clubName: string;
  clubLogo?: string;
  clubCity?: string;
  rank: string;
  rankDescription: string;
  status: string;
  permissions?: {
    canCreateEvent: boolean;
    canManageMembers: boolean;
    canManageCity: boolean;
    canSendAnnouncement: boolean;
    canAddProduct: boolean;
    canManageClub: boolean;
    canRemoveMember: boolean;
    canManageEvents: boolean;
  };
}

export interface UserProfile {
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
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  hasProfilePicture: boolean;
  isActive: boolean;
  clubMemberships?: ClubMembership[];
  role?: {
    id: number;
    name: string;
  };
  status?: {
    id: number;
    name: string;
  };
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  phoneNumber?: string;
  city?: string;
  district?: string;
  motorcycleBrand?: string;
  motorcycleModel?: string;
  motorcycleCc?: number;
  bloodType?: string;
  clothingSize?: string;
  driverLicenseType?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
}

export interface UploadImageResponse {
  profilePicture: string;
  hasProfilePicture: boolean;
}

export interface ImageUpload {
  uri: string;
  type: string;
  name: string;
}

class UserService {
  // Kullanıcı profili alma
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/auth/me');

      // AsyncStorage'a kaydet
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Profil bilgilerini güncelleme
  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const response = await apiClient.patch('/auth/me', profileData);

      // Önbelleğe alınmış kullanıcı verilerini güncelle
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Profil fotoğrafını güncelleme
  async updateProfilePicture(pictureUri: string): Promise<UploadImageResponse> {
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
        parsedUserData.hasProfilePicture = response.data.hasProfilePicture;
        await AsyncStorage.setItem('user_data', JSON.stringify(parsedUserData));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Profil fotoğrafını silme
  async deleteProfilePicture(): Promise<{success: boolean}> {
    try {
      const response = await apiClient.delete('/auth/me/profile-picture');

      // Önbelleğe alınmış kullanıcı verilerini güncelle
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        parsedUserData.profilePicture = null;
        parsedUserData.hasProfilePicture = false;
        await AsyncStorage.setItem('user_data', JSON.stringify(parsedUserData));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Mevcut kullanıcı bilgilerini AsyncStorage'dan alma
  async getCachedUserData(): Promise<UserProfile | null> {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('AsyncStorage veri alırken hata:', error);
      return null;
    }
  }

  // OneSignal ID güncelleme
  async updateOneSignalPlayerId(playerId: string): Promise<{success: boolean}> {
    try {
      const response = await apiClient.put('/auth/me/onesignal-id', {
        oneSignalPlayerId: playerId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
