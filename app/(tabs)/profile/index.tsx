import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, LogOut, Camera, Car, CreditCard, History } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '@/app/storage';

// More reliable Unsplash URL with proper sizing and optimization
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=80';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: 'Achraf Ikisse',
    email: 'ik.achraf04@gmail.com',
    birthdate: '04/01/2004',
    avatar: DEFAULT_AVATAR,
    totalCharges: 0,
    totalSpent: 0,
    memberSince: 'January 2024',
    location: 'Rabat, Morocco'
  });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadChargingHistory = async () => {
      try {
        const sessionsStr = await storage.getItem('chargingSessions');
        if (sessionsStr) {
          const sessions = JSON.parse(sessionsStr);
          const totalCharges = sessions.length;
          const totalSpent = sessions.reduce((sum, session) => sum + session.cost, 0);
          
          setUser(prev => ({
            ...prev,
            totalCharges,
            totalSpent
          }));
        }
      } catch (error) {
        console.error('Error loading charging history:', error);
      }
    };

    loadChargingHistory();
  }, []);

  const handleImageError = () => {
    setImageError(true);
    setUser(prev => ({
      ...prev,
      avatar: DEFAULT_AVATAR
    }));
  };

  const handleImagePick = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to change your profile picture.');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageError(false);
      setUser(prev => ({
        ...prev,
        avatar: result.assets[0].uri
      }));
    }
  };

  const handleLogout = () => {
    router.replace('/auth/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={handleImagePick}>
          <Image 
            source={{ uri: imageError ? DEFAULT_AVATAR : user.avatar }}
            style={styles.avatar}
            onError={handleImageError}
          />
          <View style={styles.cameraButton}>
            <Camera size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.birthdate}>Born {user.birthdate}</Text>
        <Text style={styles.location}>{user.location}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.totalCharges}</Text>
          <Text style={styles.statLabel}>Total Charges</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${user.totalSpent.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.memberSince}</Text>
          <Text style={styles.statLabel}>Member Since</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/profile/vehicles')}>
          <Car size={24} color="#8B5CF6" />
          <Text style={styles.menuText}>My Vehicles</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/profile/payment-methods')}>
          <CreditCard size={24} color="#8B5CF6" />
          <Text style={styles.menuText}>Payment Methods</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/history')}>
          <History size={24} color="#8B5CF6" />
          <Text style={styles.menuText}>Charging History</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/profile/settings')}>
          <Settings size={24} color="#8B5CF6" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={24} color="#EF4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#8B5CF6',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  birthdate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  menuSection: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FEE2E2',
    margin: 16,
    borderRadius: 12,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
});