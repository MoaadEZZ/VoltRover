import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, Banknote, Plus } from 'lucide-react-native';
import { storage } from '../storage';

const PRICE_PER_KWH = 0.30;

const SAVED_CARDS = [
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
];

export default function PaymentScreen() {
  const router = useRouter();
  const [kwh, setKwh] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedCard, setSelectedCard] = useState(SAVED_CARDS.find(card => card.isDefault)?.id);
  const [showNewCard, setShowNewCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
  });

  const totalCost = Number(kwh) * PRICE_PER_KWH;

  const handlePayment = async () => {
    if (!kwh) {
      Alert.alert('Error', 'Please enter the amount of kWh');
      return;
    }

    if (!paymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (paymentMethod === 'card') {
      if (!selectedCard && !showNewCard) {
        Alert.alert('Error', 'Please select a card');
        return;
      }

      if (showNewCard) {
        if (!newCard.number || !newCard.expiry || !newCard.cvc) {
          Alert.alert('Error', 'Please fill in all card details');
          return;
        }
      }
    }

    setProcessing(true);

    try {
      const currentOrderStr = await storage.getItem('currentOrder');
      const currentOrder = currentOrderStr ? JSON.parse(currentOrderStr) : {};
      
      const paymentRecord = {
        id: Date.now(),
        date: new Date().toISOString(),
        kwh: Number(kwh),
        cost: totalCost,
        vehicle: currentOrder.vehicle || 'Unknown Vehicle',
        batteryType: currentOrder.batteryType || 'Unknown Battery',
        paymentMethod,
        cardDetails: paymentMethod === 'card' && selectedCard 
          ? SAVED_CARDS.find(card => card.id === selectedCard)
          : paymentMethod === 'card' 
            ? { type: 'New Card', last4: newCard.number.slice(-4) }
            : null
      };

      const existingSessionsStr = await storage.getItem('chargingSessions');
      const existingSessions = existingSessionsStr ? JSON.parse(existingSessionsStr) : [];
      
      existingSessions.unshift(paymentRecord);
      
      await storage.setItem('chargingSessions', JSON.stringify(existingSessions));

      setTimeout(() => {
        setProcessing(false);
        Alert.alert(
          'Payment Successful',
          'Your payment has been processed successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.push('/')
            }
          ]
        );
      }, 1500);
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Payment Details</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Energy Required (kWh)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={kwh}
            onChangeText={setKwh}
            placeholder="Enter kWh"
            placeholderTextColor="#8B5CF6"
          />
        </View>

        <View style={styles.paymentMethods}>
          <Text style={styles.label}>Select Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('card')}>
            <CreditCard
              size={24}
              color={paymentMethod === 'card' ? '#fff' : '#8B5CF6'}
            />
            <Text
              style={[
                styles.paymentOptionText,
                paymentMethod === 'card' && styles.paymentOptionTextSelected,
              ]}>
              Credit Card
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cash' && styles.paymentOptionSelected,
            ]}
            onPress={() => {
              setPaymentMethod('cash');
              setSelectedCard(null);
              setShowNewCard(false);
            }}>
            <Banknote
              size={24}
              color={paymentMethod === 'cash' ? '#fff' : '#8B5CF6'}
            />
            <Text
              style={[
                styles.paymentOptionText,
                paymentMethod === 'cash' && styles.paymentOptionTextSelected,
              ]}>
              Cash
            </Text>
          </TouchableOpacity>
        </View>

        {paymentMethod === 'card' && (
          <View style={styles.cardSection}>
            {SAVED_CARDS.map(card => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.savedCard,
                  selectedCard === card.id && styles.selectedCard,
                ]}
                onPress={() => {
                  setSelectedCard(card.id);
                  setShowNewCard(false);
                }}>
                <View style={styles.cardHeader}>
                  <CreditCard
                    size={24}
                    color={selectedCard === card.id ? '#fff' : '#8B5CF6'}
                  />
                  <Text
                    style={[
                      styles.cardTypeText,
                      selectedCard === card.id && styles.selectedCardText,
                    ]}>
                    {card.type} •••• {card.last4}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.cardExpiry,
                    selectedCard === card.id && styles.selectedCardText,
                  ]}>
                  Expires {card.expiry}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.newCardButton,
                showNewCard && styles.selectedCard,
              ]}
              onPress={() => {
                setShowNewCard(true);
                setSelectedCard(null);
              }}>
              <Plus
                size={24}
                color={showNewCard ? '#fff' : '#8B5CF6'}
              />
              <Text
                style={[
                  styles.newCardText,
                  showNewCard && styles.selectedCardText,
                ]}>
                Add New Card
              </Text>
            </TouchableOpacity>

            {showNewCard && (
              <View style={styles.newCardForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Card Number"
                  placeholderTextColor="#8B5CF6"
                  value={newCard.number}
                  onChangeText={(text) => setNewCard({ ...newCard, number: text })}
                  keyboardType="numeric"
                  maxLength={16}
                />
                <View style={styles.cardRow}>
                  <TextInput
                    style={[styles.input, styles.cardRowInput]}
                    placeholder="MM/YY"
                    placeholderTextColor="#8B5CF6"
                    value={newCard.expiry}
                    onChangeText={(text) => setNewCard({ ...newCard, expiry: text })}
                    maxLength={5}
                  />
                  <TextInput
                    style={[styles.input, styles.cardRowInput]}
                    placeholder="CVC"
                    placeholderTextColor="#8B5CF6"
                    value={newCard.cvc}
                    onChangeText={(text) => setNewCard({ ...newCard, cvc: text })}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.summary}>
          <Text style={styles.summaryText}>Price per kWh: ${PRICE_PER_KWH.toFixed(2)}</Text>
          <Text style={styles.summaryTotal}>
            Total Cost: ${isNaN(totalCost) ? '0.00' : totalCost.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!kwh || !paymentMethod || processing) && styles.buttonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!kwh || !paymentMethod || processing}>
          <Text style={styles.buttonText}>
            {processing ? 'Processing...' : 'Confirm Payment'}
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#8B5CF6',
  },
  paymentMethods: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentOptionSelected: {
    backgroundColor: '#8B5CF6',
  },
  paymentOptionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  paymentOptionTextSelected: {
    color: '#fff',
  },
  cardSection: {
    marginBottom: 20,
  },
  savedCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  selectedCard: {
    backgroundColor: '#8B5CF6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTypeText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  selectedCardText: {
    color: '#fff',
  },
  cardExpiry: {
    fontSize: 14,
    color: '#6B7280',
  },
  newCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    marginTop: 8,
  },
  newCardText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  newCardForm: {
    marginTop: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cardRowInput: {
    flex: 0.48,
  },
  summary: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#4B5563',
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  button: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#C4B5FD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});