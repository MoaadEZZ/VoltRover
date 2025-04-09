import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';

const VEHICLES = [
  {
    id: 1,
    name: 'Tesla Model 3',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1000',
    year: '2023',
    color: 'Deep Blue Metallic',
    batteryCapacity: '82 kWh',
    range: '358 miles',
    lastCharged: '2024-02-15',
    chargingPreference: 'Home Charging',
    vin: 'WVWAA71K08W201657'
  }
];

export default function VehiclesScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Vehicles</Text>
      
      {VEHICLES.map(vehicle => (
        <View key={vehicle.id} style={styles.vehicleCard}>
          <Image
            source={{ uri: vehicle.image }}
            style={styles.vehicleImage}
          />
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
            <Text style={styles.vehicleYear}>{vehicle.year}</Text>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Color</Text>
                <Text style={styles.detailValue}>{vehicle.color}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Battery</Text>
                <Text style={styles.detailValue}>{vehicle.batteryCapacity}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Range</Text>
                <Text style={styles.detailValue}>{vehicle.range}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Last Charged</Text>
                <Text style={styles.detailValue}>{vehicle.lastCharged}</Text>
              </View>
            </View>

            <View style={styles.vinSection}>
              <Text style={styles.vinLabel}>VIN</Text>
              <Text style={styles.vinValue}>{vehicle.vin}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  vehicleInfo: {
    padding: 16,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  vehicleYear: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  detailItem: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  vinSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  vinLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  vinValue: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'monospace',
  },
});