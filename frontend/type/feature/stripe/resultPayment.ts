interface ResultPayment {
    id: string;
    object: string;
    amount: number;
    amount_details: {
      tip: object;
    };
    automatic_payment_methods: {
      allow_redirects: string;
      enabled: boolean;
    };
    canceled_at: number | null;
    cancellation_reason: string | null;
    capture_method: string;
    client_secret: string;
    confirmation_method: string;
    created: number;
    currency: string;
    description: string | null;
    last_payment_error: unknown | null;
    livemode: boolean;
    next_action: unknown | null;
    payment_method: string;
    payment_method_configuration_details: {
      id: string;
      parent: string | null;
    };
    payment_method_types: string[];
    processing: unknown | null;
    receipt_email: string;
    setup_future_usage: unknown | null;
    shipping: unknown | null;
    source: unknown | null;
    status: string;
  }

export default ResultPayment;