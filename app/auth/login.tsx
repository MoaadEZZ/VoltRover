import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LogIn } from 'lucide-react-native';

const VALID_EMAIL = 'ik.achraf04@gmail.com';
const VALID_PASSWORD = '123';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setTimeout(() => {
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        router.replace('/(tabs)');
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200' }}
          style={styles.backgroundImage}
        />
        
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <LogIn size={32} color="#8B5CF6" />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your VoltRover account</Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signupLink}
            onPress={() => router.push('/auth/signup')}
            disabled={loading}
          >
            <Text style={styles.signupText}>
              Don't have an account? <Text style={styles.signupTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  formContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#C4B5FD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signupTextBold: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
});