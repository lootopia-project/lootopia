import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { handlePayment as handlePaymentService } from '@/services/PaymentService';
import { useLanguage } from '@/hooks/providers/LanguageProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function CheckoutScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { i18n } = useLanguage();
  const stripe = useStripe();
  
  const handlePayment = async () => {
    setLoading(true);

    try {
      const data = await handlePaymentService();
      const { paymentIntent } = data;
      const returnPayment =
        await stripe.confirmPayment(paymentIntent, {
          paymentMethodType: 'Card'
        });

      if (returnPayment.error) {
        setPaymentStatus(i18n.t('Payment failure'));
      } else {
        const setResult = {
          amount: returnPayment.paymentIntent.amount,
          currency: returnPayment.paymentIntent.currency,
          receipt_email: returnPayment.paymentIntent.receiptEmail,
          status: returnPayment.paymentIntent.status
        }
        await AsyncStorage.setItem('result', JSON.stringify(setResult));
        setPaymentStatus(i18n.t('Successful payment'));
      }
    } catch (error) {
      setPaymentStatus(i18n.t("Payment error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>{i18n.t("Secure payment")}</Text>

        <View style={styles.cardFieldWrapper}>
          <CardField
            postalCodeEnabled={false}
            style={styles.cardField}
            cardStyle={{
              backgroundColor: '#FFFFFF',
              textColor: '#000000',
            }}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title={i18n.t("Pay")} onPress={handlePayment} />
        )}

        {paymentStatus && (
          <Text style={styles.statusText}>{paymentStatus}</Text>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 200,
  },
  cardContainer: {
    width: '90%',
    maxWidth: 340,
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
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardFieldWrapper: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  cardField: {
    height: 40,
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
