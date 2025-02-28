import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
const stripePromise = loadStripe(publishableKey);


export default function StripeProvider({ children }: { children: React.ReactElement | React.ReactElement[] }) {
    return <Elements stripe={stripePromise}>{children}</Elements>;
  }
