import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Club {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  coverPhotoUrl: string;
  type: 'PROFESSIONAL' | 'AMATEUR' | 'SOCIAL';
  memberCount: number;
  isPrivate: boolean;
  city: string;
  district: string;
  membershipStatus: 'MEMBER' | 'PENDING' | 'NONE';
  role?: 'ADMIN' | 'MODERATOR' | 'MEMBER';
}

export interface ClubListResponse {
  clubs: Club[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface ClubAnnouncement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
  attachments?: Array<{
    id: string;
    url: string;
    type: string;
    name: string;
  }>;
}

export interface ClubMember {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: string;
}

class ClubService {
  // Kulüpleri listele
  async getClubs(
    page = 1,
    limit = 10,
    filter?: {
      search?: string;
      type?: string;
      city?: string;
      district?: string;
    },
  ): Promise<ClubListResponse> {
    try {
      const response = await apiClient.get('/clubs', {
        params: { page, limit, ...filter },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kulüp detayı getir
  async getClubById(clubId: string): Promise<Club> {
    try {
      const response = await apiClient.get(`/clubs/${clubId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kulüp oluştur
  async createClub(clubData: Partial<Club>): Promise<Club> {
    try {
      const response = await apiClient.post('/clubs', clubData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kulüp güncelle
  async updateClub(clubId: string, clubData: Partial<Club>): Promise<Club> {
    try {
      const response = await apiClient.patch(`/clubs/${clubId}`, clubData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kulüp logo/kapak fotoğrafı yükle
  async uploadClubPhoto(
    clubId: string,
    imageUri: string,
    type: 'logo' | 'cover',
  ): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append(type === 'logo' ? 'logo' : 'coverPhoto', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `${type}-photo.jpg`,
      });

      const response = await apiClient.post(
        `/clubs/${clubId}/${type === 'logo' ? 'logo' : 'cover-photo'}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kulübe katılma isteği gönder
  async joinClub(
    clubId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post(`/clubs/${clubId}/join`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kulüpten ayrıl
  async leaveClub(clubId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post(`/clubs/${clubId}/leave`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kulübü sil
  async deleteClub(clubId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(`/clubs/${clubId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kulüp üyelerini getir
  async getClubMembers(
    clubId: string,
    page = 1,
    limit = 20,
  ): Promise<{ members: ClubMember[]; totalCount: number }> {
    try {
      const response = await apiClient.get(`/clubs/${clubId}/members`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kulüp duyurularını getir
  async getClubAnnouncements(
    clubId: string,
    page = 1,
    limit = 10,
  ): Promise<{ announcements: ClubAnnouncement[]; totalCount: number }> {
    try {
      const response = await apiClient.get(`/clubs/${clubId}/announcements`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kulüp duyurusu oluştur
  async createAnnouncement(
    clubId: string,
    data: { title: string; content: string },
  ): Promise<ClubAnnouncement> {
    try {
      const response = await apiClient.post(
        `/clubs/${clubId}/announcements`,
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcının üye olduğu kulüpleri getir
  async getUserClubs(page = 1, limit = 10): Promise<ClubListResponse> {
    try {
      const response = await apiClient.get('/user/clubs', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcının yönettiği kulüpleri getir
  async getUserManagedClubs(page = 1, limit = 10): Promise<ClubListResponse> {
    try {
      const response = await apiClient.get('/user/managed-clubs', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ClubService();
