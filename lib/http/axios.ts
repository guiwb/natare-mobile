import axios from 'axios';
import { getItemAsync } from 'expo-secure-store';

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
