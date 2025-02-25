import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { handlePayment as handlePaymentService } from '@/services/PaymentService';

export default function CheckoutScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const { confirmPayment } = useConfirmPayment();

  const handlePayment = async () => {
    setLoading(true);

    try {
      const data= await handlePaymentService();
      const { paymentIntent } = data;
        
        const { error, paymentIntent: mobilePaymentIntent } = await confirmPayment(
            paymentIntent,
            {
              paymentMethodType: 'Card',
            }
          );          
  
          if (error) {
            setPaymentStatus('Échec du paiement');
          } else {
            setPaymentStatus('Paiement réussi 🎉');
          }
    } catch (error) {
      setPaymentStatus("Erreur lors du paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Paiement sécurisé</Text>
        <View style={styles.form}>
        {/**
         * CardField est un composant de @stripe/stripe-react-native
         * qui gère l’affichage de la carte, le style, la validation, etc.
         */}
        <CardField
          postalCodeEnabled={false}
          style={styles.cardField}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          onCardChange={(cardDetails) => {
            // Vous pouvez récupérer ici les données de la carte si besoin
            // console.log(cardDetails);
          }}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Payer" onPress={handlePayment} />
      )}

      {paymentStatus && <Text>{paymentStatus}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 40,
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      marginVertical: 10,
    },
    form: {
      width: '100%',
      marginVertical: 20,
    },
    input: {
      borderBottomWidth: 1,
      marginBottom: 10,
      padding: 5,
    },
    cardField: {
      height: 50,
      marginVertical: 10,
    },
    status: {
      marginTop: 20,
      fontSize: 16,
      color: 'green',
    },
  });