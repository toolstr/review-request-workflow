export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
export interface UsageMetric {
  id: string;
  name: string;
  eventName: string;
  allTimeValue: number;
  currentPeriod: string;
  currentPeriodStartDate: string | null;
  currentPeriodEndDate: string | null;
}

export interface Milestone {
  name: string; // Milestone name (e.g., "QR Code created")
  targets: number[]; // Array of target thresholds (e.g., [1, 5, 10])
  source: string; // Key in `customer.usage` (e.g., "QR Code Created")
}


// Example Usage:
// const usage: Usage = {
//   "Automatic QR Codes": {
//     id: "0d8281e1-3347-4c90-a8ff-71edb4a72328",
//     name: "Automatic QR Codes",
//     eventName: "automatic_qr_code_created",
//     allTimeValue: 0,
//     currentPeriod: "calendar_month",
//     currentPeriodStartDate: null,
//     currentPeriodEndDate: null
//   },
//   "Basic QR Codes": {
//    ... similar structure
//   }
// }




/**
 * The currently authenticated user of your app
 */
export interface Customer {
  /** The ID of the customer */
  id: string;
  /** The name of the customer */
  name?: string;
  /** Whether the customer is a test customer */
  test: boolean;
  /** The customer's preferred currency */
  preferredCurrency?: string;
  /** The platform the customer is on, one of "shopify", "web" or "mantle" */
  platform?: "shopify" | "web" | "mantle";
  /** The ID of the customer on the platform */
  platformId?: string;
  /** The myshopify domain of the customer, if on the Shopify platform */
  myshopifyDomain?: string;
  /** The date the customer was first seen or installed */
  installedAt?: Date;
  /** If the customer has or had a trial, the date that it started */
  trialStartsAt?: Date;
  /** If the customer has or had a trial, the date that it ended */
  trialExpiresAt?: Date;
  /** The plans available to the customer */
  plans: unknown[];
  /** The subscription of the current customer, if any */
  subscription?: unknown;
  /** The payment method of the current customer, if any */
  paymentMethod?: unknown;
  /** The features enabled for the current customer */
  features: Record<string, unknown>;
  /** The usage metrics for the current customer */
  usage: Record<string, UsageMetric>;
  /** The custom fields on the customer */
  customFields?: Record<string, unknown>;
  /** The invoice of the current customer, if the customer is billed via Stripe */
  currentInvoice?: unknown;
  /** The usage credits of the customer */
  usageCredits: unknown[];
  /** Reviews left by the customer on a platform's app store */
  reviews: Review[];
  /** The current billing status of the customer */
  billingStatus: "none" | "active" | "trialing" | "canceled" | "frozen";
}




export interface ReviewPromptProps {
  customer: Customer;
  milestones: Milestone[];
  title?: string;
  message?: string;
  dismissLabel?: string;
  reviewLabel?: string;
  onReview?: () => void;
  reviewUrl: string;
  doNotAskLabel?: string;
  remindLaterLabel?: string;
  confirmLabel?: string;
}
