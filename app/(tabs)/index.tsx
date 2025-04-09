import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Battery, Car, Zap } from 'lucide-react-native';
import { storage } from '../storage';

const VEHICLES = [
  { id: 1, name: 'Tesla Model 3', batteryCapacity: '82 kWh' },
  { id: 2, name: 'Tesla Model Y', batteryCapacity: '75 kWh' },
  { id: 3, name: 'Chevrolet Bolt', batteryCapacity: '65 kWh' },
  { id: 4, name: 'Nissan Leaf', batteryCapacity: '62 kWh' },
  { id: 5, name: 'Ford Mustang Mach-E', batteryCapacity: '88 kWh' },
  { id: 6, name: 'Hyundai IONIQ 5', batteryCapacity: '77.4 kWh' },
  { id: 7, name: 'Kia EV6', batteryCapacity: '77.4 kWh' },
  { id: 8, name: 'Volkswagen ID.4', batteryCapacity: '82 kWh' },
  { id: 9, name: 'Polestar 2', batteryCapacity: '78 kWh' },
  { id: 10, name: 'Other', batteryCapacity: 'Custom' },
];

const BATTERY_TYPES = [
  { id: 1, name: 'Lithium-ion (NMC)', chargingSpeed: 'Very Fast', details: 'High energy density, common in Tesla vehicles' },
  { id: 2, name: 'LiFePO4', chargingSpeed: 'Medium', details: 'Very safe, longer lifespan' },
  { id: 3, name: 'NCA', chargingSpeed: 'Very Fast', details: 'High energy density, used in Tesla' },
  { id: 4, name: 'Solid State', chargingSpeed: 'Ultra Fast', details: 'Next-gen technology' },
  { id: 5, name: 'LMO', chargingSpeed: 'Fast', details: 'Safe and stable' },
];

export default function RequestScreen() {
  const router = useRouter();
  const [requesting, setRequesting] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedBattery, setSelectedBattery] = useState('');
  const [customVehicle, setCustomVehicle] = useState('');
  const [customBatteryCapacity, setCustomBatteryCapacity] = useState('');

  const handleRequest = async () => {
    if ((!selectedVehicle && !customVehicle) || !selectedBattery) {
      alert('Please select both vehicle and battery type');
      return;
    }

    const vehicleInfo = selectedVehicle === '10' 
      ? { name: customVehicle, batteryCapacity: customBatteryCapacity }
      : VEHICLES.find(v => v.id.toString() === selectedVehicle);

    const batteryInfo = BATTERY_TYPES.find(b => b.id.toString() === selectedBattery);

    const orderData = {
      vehicle: vehicleInfo?.name,
      batteryCapacity: vehicleInfo?.batteryCapacity,
      batteryType: batteryInfo?.name,
      date: new Date().toISOString(),
    };
    await storage.setItem('currentOrder', JSON.stringify(orderData));

    setRequesting(true);
    router.push('/tracking');
  };

  const renderSelector = (title: string, items: typeof VEHICLES | typeof BATTERY_TYPES, value: string, onChange: (value: string) => void) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {title === 'Select Your Vehicle' ? <Car size={24} color="#8B5CF6" /> : <Zap size={24} color="#8B5CF6" />}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.optionCard,
              item.id.toString() === value && styles.optionCardSelected
            ]}
            onPress={() => onChange(item.id.toString())}>
            <Text style={[
              styles.optionTitle,
              item.id.toString() === value && styles.optionTitleSelected
            ]}>{item.name}</Text>
            <Text style={[
              styles.optionSubtitle,
              item.id.toString() === value && styles.optionSubtitleSelected
            ]}>{title === 'Select Your Vehicle' ? item.batteryCapacity : item.chargingSpeed}</Text>
            {('details' in item) && (
              <Text style={[
                styles.optionDetails,
                item.id.toString() === value && styles.optionDetailsSelected
              ]}>{item.details}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedVehicle === '10' && title === 'Select Your Vehicle' && (
        <View style={styles.customVehicleInputs}>
          <TextInput
            style={styles.customInput}
            placeholder="Enter your vehicle model"
            placeholderTextColor="#8B5CF6"
            value={customVehicle}
            onChangeText={setCustomVehicle}
          />
          <TextInput
            style={styles.customInput}
            placeholder="Battery capacity (kWh)"
            placeholderTextColor="#8B5CF6"
            value={customBatteryCapacity}
            onChangeText={setCustomBatteryCapacity}
            keyboardType="numeric"
          />
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.headerTitle}>VoltRover</Text>
          <Text style={styles.headerSubtitle}>Mobile EV Charging Service</Text>
        </View>
      </View>

      <View style={styles.content}>
        {renderSelector('Select Your Vehicle', VEHICLES, selectedVehicle, setSelectedVehicle)}
        {renderSelector('Battery Type', BATTERY_TYPES, selectedBattery, setSelectedBattery)}

        <TouchableOpacity
          style={[styles.button, (!selectedVehicle || !selectedBattery || requesting) && styles.buttonDisabled]}
          onPress={handleRequest}
          disabled={!selectedVehicle || !selectedBattery || requesting}>
          <Battery size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>
            {requesting ? 'Requesting...' : 'Request Charging Truck'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 200,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#1F2937',
  },
  optionsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  optionCard: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 200,
  },
  optionCardSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: '#fff',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  optionSubtitleSelected: {
    color: '#fff',
    opacity: 0.9,
  },
  optionDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  optionDetailsSelected: {
    color: '#fff',
    opacity: 0.8,
  },
  customVehicleInputs: {
    marginTop: 10,
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
    color: '#8B5CF6',
  },
  button: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#C4B5FD',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});