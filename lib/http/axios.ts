import axios from 'axios';
import { getItemAsync } from 'expo-secure-store';
import { DeviceEventEmitter } from 'react-native';

export const http = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

http.interceptors.request.use(async (config) => {
  const token = await getItemAsync('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      DeviceEventEmitter.emit('on401');
    }

    return Promise.reject(error);
  },
);
