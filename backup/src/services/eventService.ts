import apiClient from './api';

export interface Event {
  id: string;
  title: string;
  description: string;
  coverPhotoUrl: string;
  startDate: string;
  endDate: string;
  location: {
    title: string;
    latitude: number;
    longitude: number;
    city: string;
    district: string;
    address: string;
  };
  route?: {
    startPoint: {
      title: string;
      latitude: number;
      longitude: number;
    };
    endPoint: {
      title: string;
      latitude: number;
      longitude: number;
    };
    waypoints: Array<{
      title: string;
      latitude: number;
      longitude: number;
    }>;
    distance: number; // kilometre
    duration: number; // dakika
  };
  maxParticipants: number;
  currentParticipants: number;
  organizerId: string;
  organizer: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
  clubId?: string;
  club?: {
    id: string;
    name: string;
    logoUrl: string;
  };
  eventType: 'RIDE' | 'MEETING' | 'TRAINING' | 'OTHER';
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  isPrivate: boolean;
  participationStatus: 'JOINED' | 'PENDING' | 'NONE';
  participants: Array<{
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  }>;
  tags: string[];
}

export interface EventListResponse {
  events: Event[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface EventParticipant {
  id: string;
  userId: string;
  eventId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  joinedAt: string;
  status: 'CONFIRMED' | 'PENDING';
}

class EventService {
  // Etkinlikleri listele
  async getEvents(
    page = 1,
    limit = 10,
    filter?: {
      type?: string;
      startDate?: string;
      endDate?: string;
      city?: string;
      district?: string;
      clubId?: string;
    },
  ): Promise<EventListResponse> {
    try {
      const response = await apiClient.get('/events', {
        params: { page, limit, ...filter },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Etkinlik detayı getir
  async getEventById(eventId: string): Promise<Event> {
    try {
      const response = await apiClient.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Etkinlik katılımcılarını getir
  async getEventParticipants(
    eventId: string,
    page = 1,
    limit = 20,
  ): Promise<{ participants: EventParticipant[]; totalCount: number }> {
    try {
      const response = await apiClient.get(`/events/${eventId}/participants`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Etkinlik oluştur
  async createEvent(eventData: Partial<Event>): Promise<Event> {
    try {
      const response = await apiClient.post('/events', eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Etkinlik güncelle
  async updateEvent(
    eventId: string,
    eventData: Partial<Event>,
  ): Promise<Event> {
    try {
      const response = await apiClient.patch(`/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Etkinlik kapak fotoğrafı yükle
  async uploadEventCoverPhoto(
    eventId: string,
    imageUri: string,
  ): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('coverPhoto', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'cover-photo.jpg',
      });

      const response = await apiClient.post(
        `/events/${eventId}/cover-photo`,
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

  // Etkinliğe katılma isteği gönder
  async joinEvent(
    eventId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post(`/events/${eventId}/join`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Etkinlikten ayrıl
  async leaveEvent(eventId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post(`/events/${eventId}/leave`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Etkinliği iptal et (organizatör)
  async cancelEvent(eventId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post(`/events/${eventId}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Etkinliği sil
  async deleteEvent(eventId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Etkinliğe katılım isteğini onayla (organizatör)
  async approveParticipant(
    eventId: string,
    userId: string,
  ): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post(
        `/events/${eventId}/participants/${userId}/approve`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Etkinlikten katılımcı çıkar (organizatör)
  async removeParticipant(
    eventId: string,
    userId: string,
  ): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(
        `/events/${eventId}/participants/${userId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcının katıldığı etkinlikleri getir
  async getUserEvents(
    status: 'UPCOMING' | 'COMPLETED' | 'ALL' = 'ALL',
    page = 1,
    limit = 10,
  ): Promise<EventListResponse> {
    try {
      const response = await apiClient.get('/user/events', {
        params: { status, page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcının organize ettiği etkinlikleri getir
  async getUserOrganizedEvents(
    status: 'UPCOMING' | 'COMPLETED' | 'ALL' = 'ALL',
    page = 1,
    limit = 10,
  ): Promise<EventListResponse> {
    try {
      const response = await apiClient.get('/user/organized-events', {
        params: { status, page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kulübün etkinliklerini getir
  async getClubEvents(
    clubId: string,
    status: 'UPCOMING' | 'COMPLETED' | 'ALL' = 'ALL',
    page = 1,
    limit = 10,
  ): Promise<EventListResponse> {
    try {
      const response = await apiClient.get(`/clubs/${clubId}/events`, {
        params: { status, page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new EventService();
