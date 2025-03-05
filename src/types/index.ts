export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
export interface MetricData {
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


export interface Usage {
  [key: string]: MetricData;  // This allows any string key mapping to MetricData
}

export interface Customer {
  id: string;
  name: string;
  reviews: Review[];
  usage: Usage; // Changed from { [key: string]: number } to Usage type
}

