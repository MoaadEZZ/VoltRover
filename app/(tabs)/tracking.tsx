import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Platform, Dimensions, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { Truck } from 'lucide-react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

const API_KEY = "8RvdvZ7lNY3uoDdkANW5iqWVkzJfhSlY4CtBZJ9dTPmAlXwnZ14JJQQJ99BCACYeBjFD2vV4AAAgAZMP3GnU";

const RABAT_COORDINATES = { latitude: 34.0209, longitude: -6.8416 };

const CHARGING_STATIONS = [
  { id: 1, name: 'VoltRover Agdal', coordinate: { latitude: 33.9927, longitude: -6.8544 } },
  { id: 2, name: 'VoltRover Hassan', coordinate: { latitude: 34.0209, longitude: -6.8416 } },
  { id: 3, name: 'VoltRover Hay Riad', coordinate: { latitude: 33.9626, longitude: -6.8568 } },
];

export default function TrackingScreen() {
  const [userLocation, setUserLocation] = useState(RABAT_COORDINATES);
  const [truckLocation, setTruckLocation] = useState(CHARGING_STATIONS[0].coordinate);
  const [route, setRoute] = useState([]);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        setUserLocation(RABAT_COORDINATES);
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const fetchRoute = async (start, end) => {
    try {
      const response = await axios.get(
        `https://atlas.microsoft.com/route/directions/json?subscription-key=${API_KEY}&api-version=1.0&query=${start.latitude},${start.longitude}:${end.latitude},${end.longitude}`
      );

      if (response.data.routes.length > 0) {
        const routeData = response.data.routes[0].legs[0].points.map(point => ({
          latitude: point.latitude,
          longitude: point.longitude,
        }));

        setRoute(routeData);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const startTracking = () => {
    setIsTracking(true);

    fetchRoute(truckLocation, userLocation);
  };

  useEffect(() => {
    if (!isTracking || route.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < route.length) {
        setTruckLocation(route[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [route, isTracking]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...RABAT_COORDINATES,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        
        <Marker coordinate={truckLocation} title="VoltRover Truck">
          <Truck size={24} color="#8B5CF6" />
        </Marker>
        
        <Marker coordinate={userLocation} title="Your Location" pinColor="#8B5CF6" />

        {CHARGING_STATIONS.map(station => (
          <Marker
            key={station.id}
            coordinate={station.coordinate}
            title={station.name}
            pinColor="#4C1D95"
          />
        ))}

        <Polyline coordinates={route} strokeColor="#8B5CF6" strokeWidth={3} />
      </MapView>

      <View style={styles.overlay}>
        <Text style={styles.eta}>{isTracking ? 'ETA: 30 minutes' : 'Call a truck to start tracking'}</Text>
        <Text style={styles.status}>
          {isTracking ? 'VoltRover truck is en route to your location' : 'Press the button below to request a truck'}
        </Text>
        {isTracking && (
          <Text style={styles.coordinates}>
            Current Location: {truckLocation.latitude.toFixed(4)}, {truckLocation.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.callTruckButtonBottom} onPress={startTracking}>
        <Text style={styles.buttonText}>Call Truck</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },

  overlay: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eta: { fontSize: 18, fontWeight: 'bold', color: '#8B5CF6', textAlign: 'center', marginBottom: 5 },
  status: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 8 },
  coordinates: { fontSize: 12, color: '#888', textAlign: 'center' },

  callTruckButtonTop: {
    position: 'absolute',
    top: 50,
    left: '50%',
    transform: [{ translateX: -75 }],
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 1,
  },

  callTruckButtonBottom: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },

  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
