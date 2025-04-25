import apiClient from './api';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  isImportant: boolean;
  type: 'GENERAL' | 'EVENT' | 'CLUB' | 'SYSTEM';
  relatedEntityId?: string; // İlgili etkinlik veya kulüp ID'si
  publisherId: string;
  publisher: {
    id: string;
    name: string;
    logoUrl?: string;
    type: 'ADMIN' | 'CLUB' | 'SYSTEM';
  };
}

export interface AnnouncementListResponse {
  announcements: Announcement[];
  totalCount: number;
  unreadCount: number;
  page: number;
  limit: number;
}

class AnnouncementService {
  // Duyuruları listele
  async getAnnouncements(
    page = 1,
    limit = 10,
    filter?: {
      isRead?: boolean;
      isImportant?: boolean;
      type?: 'GENERAL' | 'EVENT' | 'CLUB' | 'SYSTEM';
      publisherId?: string;
    },
  ): Promise<AnnouncementListResponse> {
    try {
      const response = await apiClient.get('/announcements', {
        params: {page, limit, ...filter},
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Duyuru detayı getir
  async getAnnouncementById(announcementId: string): Promise<Announcement> {
    try {
      const response = await apiClient.get(`/announcements/${announcementId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Duyuruyu okundu olarak işaretle
  async markAsRead(announcementId: string): Promise<{success: boolean}> {
    try {
      const response = await apiClient.post(
        `/announcements/${announcementId}/read`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Tüm duyuruları okundu olarak işaretle
  async markAllAsRead(): Promise<{success: boolean; count: number}> {
    try {
      const response = await apiClient.post('/announcements/read-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Duyuru oluştur (admin ve kulüp yöneticileri için)
  async createAnnouncement(
    announcementData: Partial<Announcement>,
  ): Promise<Announcement> {
    try {
      const response = await apiClient.post('/announcements', announcementData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Duyuruyu güncelle (admin ve kulüp yöneticileri için)
  async updateAnnouncement(
    announcementId: string,
    announcementData: Partial<Announcement>,
  ): Promise<Announcement> {
    try {
      const response = await apiClient.patch(
        `/announcements/${announcementId}`,
        announcementData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Duyuruyu sil (admin ve kulüp yöneticileri için)
  async deleteAnnouncement(
    announcementId: string,
  ): Promise<{success: boolean}> {
    try {
      const response = await apiClient.delete(
        `/announcements/${announcementId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcının okunmamış duyuru sayısını getir
  async getUnreadCount(): Promise<{count: number}> {
    try {
      const response = await apiClient.get('/announcements/unread-count');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AnnouncementService();
