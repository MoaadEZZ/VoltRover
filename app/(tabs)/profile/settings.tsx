import { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Bell, Shield, Globe, Smartphone, CircleHelp as HelpCircle } from 'lucide-react-native';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Bell size={24} color="#8B5CF6" />
            <Text style={styles.settingText}>Push Notifications</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
            thumbColor={pushEnabled ? '#8B5CF6' : '#9CA3AF'}
          />
        </View>
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Smartphone size={24} color="#8B5CF6" />
            <Text style={styles.settingText}>SMS Alerts</Text>
          </View>
          <Switch
            value={smsEnabled}
            onValueChange={setSmsEnabled}
            trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
            thumbColor={smsEnabled ? '#8B5CF6' : '#9CA3AF'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <TouchableOpacity style={styles.setting}>
          <View style={styles.settingInfo}>
            <Globe size={24} color="#8B5CF6" />
            <Text style={styles.settingText}>Language</Text>
          </View>
          <Text style={styles.settingValue}>English</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <TouchableOpacity style={styles.setting}>
          <View style={styles.settingInfo}>
            <Shield size={24} color="#8B5CF6" />
            <Text style={styles.settingText}>Change Password</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.setting}>
          <View style={styles.settingInfo}>
            <HelpCircle size={24} color="#8B5CF6" />
            <Text style={styles.settingText}>Help Center</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>VoltRover v1.0.0</Text>
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  settingValue: {
    fontSize: 16,
    color: '#6B7280',
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});