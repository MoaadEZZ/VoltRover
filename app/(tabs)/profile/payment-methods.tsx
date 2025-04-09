import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { CreditCard, Plus, X } from 'lucide-react-native';

const PIN = '000'; // Hardcoded PIN

export default function PaymentMethodsScreen() {
  const [isVerified, setIsVerified] = useState(false);
  const [pin, setPin] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
  });
  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '8888',
      expiry: '09/24',
      isDefault: false,
    }
  ]);

  const verifyPin = () => {
    if (pin === PIN) {
      setIsVerified(true);
    } else {
      Alert.alert('Error', 'Invalid PIN');
      setPin('');
    }
  };

  const handleAddCard = () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvc) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    const cardType = newCard.number.startsWith('4') ? 'Visa' : 'Mastercard';
    const last4 = newCard.number.slice(-4);

    setCards(prev => [
      ...prev,
      {
        id: Date.now(),
        type: cardType,
        last4,
        expiry: newCard.expiry,
        isDefault: false,
      }
    ]);

    setNewCard({ number: '', expiry: '', cvc: '' });
    setShowAddCard(false);
    Alert.alert('Success', 'Card added successfully');
  };

  if (!isVerified) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Enter PIN</Text>
        <TextInput
          style={styles.pinInput}
          value={pin}
          onChangeText={setPin}
          placeholder="Enter PIN (000)"
          keyboardType="numeric"
          maxLength={3}
          secureTextEntry
        />
        <TouchableOpacity style={styles.verifyButton} onPress={verifyPin}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Payment Methods</Text>

      {cards.map(card => (
        <View key={card.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <CreditCard size={24} color="#8B5CF6" />
            <View style={styles.cardType}>
              <Text style={styles.cardTypeText}>{card.type}</Text>
              {card.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.cardDetails}>
            <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>
            <Text style={styles.expiryDate}>Expires {card.expiry}</Text>
          </View>
        </View>
      ))}

      {showAddCard ? (
        <View style={styles.addCardForm}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Add New Card</Text>
            <TouchableOpacity onPress={() => setShowAddCard(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            value={newCard.number}
            onChangeText={(text) => setNewCard({ ...newCard, number: text })}
            keyboardType="numeric"
            maxLength={16}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="MM/YY"
              value={newCard.expiry}
              onChangeText={(text) => setNewCard({ ...newCard, expiry: text })}
              maxLength={5}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVC"
              value={newCard.cvc}
              onChangeText={(text) => setNewCard({ ...newCard, cvc: text })}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
            <Text style={styles.addButtonText}>Add Card</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addCardButton} onPress={() => setShowAddCard(true)}>
          <Plus size={24} color="#8B5CF6" />
          <Text style={styles.addCardButtonText}>Add New Card</Text>
        </TouchableOpacity>
      )}
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
  pinInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  verifyButton: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardType: {
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTypeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  defaultBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  cardNumber: {
    fontSize: 16,
    color: '#4B5563',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  expiryDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#8B5CF6',
    marginTop: 8,
  },
  addCardButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  addCardForm: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});