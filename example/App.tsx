import React from "react";
import ReviewPrompt from "../src/components/ReviewPrompt";
import { Customer, Milestone } from "../src/types";
import "./index.css";
import "./App.css";

const mockCustomer: Customer = {
  id: "123",
  name: "Shopify Store",
  reviews: [],
  usage: {
    "QR Code Created": 11,
    "QR Code Updated": 0,
    "Settings Updated": 0,
  },
};

const mockMilestones: Milestone[] = [
  {
    name: "QR Code created",
    targets: [10],
    source: "QR Code Created",
  },
  {
    name: "QR Code Updated",
    targets: [1, 2, 3, 4, 5, 100],
    source: "QR Code Updated",
  },
  { name: "Settings Updated", targets: [1, 5], source: "SettingsUpdated" },
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
