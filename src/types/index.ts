export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Milestone {
  name: string; // Milestone name (e.g., "QR Code created")
  targets: number[]; // Array of target thresholds (e.g., [1, 5, 10])
  source: string; // Key in `customer.customFields` (e.g., "QRCodeCreated")
}

export interface Customer {
  id: string;
  name: string;
  reviews: Review[];
  usage: {
    [key: string]: number; // Dynamic milestone values (e.g., "QRCodeCreated": 3)
  };
}
