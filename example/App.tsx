import React from "react";
import { Customer, Milestone, ReviewPrompt } from "../src";
import "./index.css";
import "./App.css";

const mockCustomer: Customer = {
  id: "123",
  name: "Shopify Store",
  reviews: [],
  usage: {
    "Basic QR Codes": {
      id: "123",
      name: "QR Code Created",
      eventName: "basic_qr_codes_created",
      allTimeValue: 5,
      currentPeriod: "calendar_month",
      currentPeriodStartDate: null,
      currentPeriodEndDate: null,
    },
    "Dynamic QR Codes": {
      id: "123",
      name: "Dynamic QR Codes",
      eventName: "dynamic_qr_code_created",
      allTimeValue: 10,
      currentPeriod: "calendar_month",
      currentPeriodStartDate: null,
      currentPeriodEndDate: null,
    },
  },
  test: false,
  plans: [],
  features: {},
  usageCredits: [],
  billingStatus: "active",
} as Customer;

// Create an array of targets that are multiples of 5 up to 100
const multiplesOfFive = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);  // [5, 10, 15, 20, 25, ..., 100]

// Create an array of sequential targets from 1 to 5
const sequentialTargets = Array.from({ length: 20 }, (_, i) => i + 1); 

const mockMilestones: Milestone[] = [
  {
    name: "QR Code created",
    targets: multiplesOfFive, 
    source: "Basic QR Codes",
  },
  {
    name: "Dynamic QR Code Updated",
    targets: sequentialTargets, 
    source: "Dynamic QR Codes",
  },
];

const App: React.FC = () => {
  return (
    <ReviewPrompt
      customer={mockCustomer}
      milestones={mockMilestones}
      reviewUrl="https://apps.shopify.com/super-qr-codes"
      title="Enjoying QR Codes?"
      message="We'd love your feedback! Leave us a review."
      dismissLabel="Not Now"
      reviewLabel="Leave a Review"
    />
  );
};

export default App;
