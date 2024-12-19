import React from "react";
import ReviewPrompt from "./components/ReviewPrompt";
import { Customer, Milestone } from "./types";

const mockCustomer: Customer = {
  id: "123",
  name: "Shopify Store",
  reviews: [],
  customFields: {
    QRCodeCreated: 3,
    QRCodeUpdated: 1,
    SettingsUpdated: 0,
  },
};

const mockMilestones: Milestone[] = [
  {
    name: "QR Code created",
    targets: [1, 2, 3, 4, 5],
    source: "QRCodeCreated",
  },
  {
    name: "QR Code updated",
    targets: [1, 2, 3, 4, 5],
    source: "QRCodeUpdated",
  },
  { name: "Settings updated", targets: [1, 5], source: "SettingsUpdated" },
];

const App: React.FC = () => {
  return (
    <ReviewPrompt
      customer={mockCustomer}
      milestones={mockMilestones}
      reviewUrl="https://apps.shopify.com/super-qr-codes"
      title="Enjoying QR Codes?"
      message="We’d love your feedback! Leave us a review."
      dismissLabel="Not Now"
      reviewLabel="Leave a Review"
    />
  );
};

export default App;
