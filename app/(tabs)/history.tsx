import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { Battery, CreditCard, Banknote } from 'lucide-react-native';
import { storage } from '../storage';

interface ChargingSession {
  id: number;
  date: string;
  kwh: number;
  cost: number;
  vehicle: string;
  batteryType: string;
  paymentMethod: string;
}

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<ChargingSession[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const storedSessions = await storage.getItem('chargingSessions');
        if (storedSessions) {
          setSessions(JSON.parse(storedSessions));
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    };

    loadSessions();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.headerTitle}>Charging History</Text>
        </View>
      </View>
      
      <ScrollView style={styles.sessionList}>
        {sessions.map((session) => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <Text style={styles.date}>{new Date(session.date).toLocaleDateString()}</Text>
              {session.paymentMethod === 'card' ? (
                <CreditCard size={20} color="#8B5CF6" />
              ) : (
                <Banknote size={20} color="#8B5CF6" />
              )}
            </View>
            
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{session.vehicle}</Text>
              <Text style={styles.batteryType}>{session.batteryType}</Text>
            </View>
            
            <View style={styles.details}>
              <View style={styles.detailItem}>
                <Battery size={20} color="#8B5CF6" />
                <Text style={styles.kwh}>{session.kwh} kWh</Text>
              </View>
              <Text style={styles.cost}>${session.cost.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 150,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  sessionList: {
    padding: 20,
  },
  sessionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  vehicleInfo: {
    marginBottom: 10,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  batteryType: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kwh: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    marginLeft: 5,
  },
  cost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
});