// Minimal Razorpay Checkout typings for the browser SDK loaded at runtime from
// https://checkout.razorpay.com/v1/checkout.js. Only the surface we use is
// modelled; the SDK itself is untyped.

export interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayFailureResponse {
  error?: {
    code?: string;
    description?: string;
    reason?: string;
    source?: string;
    step?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: { color?: string };
  modal?: {
    escape?: boolean;
    backdropclose?: boolean;
    ondismiss?: () => void;
  };
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, handler: (response: RazorpayFailureResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
