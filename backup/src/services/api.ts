import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.yeleklidunyasi.com';

// API istemcisini oluştur
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// İstek araya girici (interceptor) ekle
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Yanıt araya girici ekle
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Token geçersiz olduğunda (401) ve bu istek daha önce yenilenmemişse
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token kullanarak yeni token al
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
          // Refresh token yoksa, kullanıcıyı çıkış yaptır
          await AsyncStorage.multiRemove([
            'auth_token',
            'refresh_token',
            'user_data',
          ]);
          // TODO: Kullanıcıyı giriş ekranına yönlendir
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data;

        // Yeni token'ları kaydet
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('refresh_token', newRefreshToken);

        // Orijinal isteği güncellenen token ile tekrarla
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token yenileme başarısız olursa, kullanıcıyı çıkış yaptır
        await AsyncStorage.multiRemove([
          'auth_token',
          'refresh_token',
          'user_data',
        ]);
        // TODO: Kullanıcıyı giriş ekranına yönlendir
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
