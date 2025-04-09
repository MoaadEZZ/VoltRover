import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage wrapper that works on both web and native
class Storage {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return window?.localStorage?.getItem(key) || null;
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        window?.localStorage?.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  }
}

export const storage = new Storage();