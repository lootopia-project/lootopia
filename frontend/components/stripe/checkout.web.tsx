import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { handlePayment as handlePaymentService } from '@/services/PaymentService';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

export default function CheckoutScreen() {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    setLoading(true);
    setPaymentStatus(null);

    try {
      // 1. Appel de votre service backend pour récupérer le clientSecret
      const data = await handlePaymentService();
      const { paymentIntent } = data;

      if (stripe && elements) {
        // 2. Confirmation du paiement avec le champ CardElement
        const { error, paymentIntent: result } = await stripe.confirmCardPayment(
          paymentIntent,
          {
            payment_method: {
              card: elements.getElement(CardElement)!,
            },
          }
        );
        setPaymentStatus(error ? 'Échec du paiement' : 'Paiement réussi 🎉');
      }
    } catch (err) {
      setPaymentStatus('Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  // Personnalisation du CardElement
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        fontFamily: 'system-ui, sans-serif',
        color: '#333',
        '::placeholder': {
          color: '#999',
        },
      },
      invalid: {
        color: '#E25950',
      },
    },
  };

  return (
    <View style={styles.pageContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>Paiement Sécurisé</Text>
        
        <View style={styles.cardElementWrapper}>
          <CardElement options={cardElementOptions} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <Button title="Payer" onPress={handlePayment} />
        )}

        {paymentStatus && (
          <Text style={styles.status}>
            {paymentStatus}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
  },
  cardContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
    fontWeight: '600',
  },
  cardElementWrapper: {
    width: '100%',
    marginBottom: 20,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  status: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
  },
});
