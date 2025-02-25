import React from 'react';
import { StripeProvider as RNStripeProvider } from '@stripe/stripe-react-native';

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;


export default function StripeProvider({ children }: { children: React.ReactElement | React.ReactElement[] }) {    
  return (
    <RNStripeProvider publishableKey={publishableKey}>
      <>{children}</>
    </RNStripeProvider>
  );
}
