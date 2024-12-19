import React, { useEffect, useState } from "react";
import { Modal, Text } from "@shopify/polaris";
import { ExternalIcon } from "@shopify/polaris-icons";
import { Customer, Milestone } from "../types";

interface ReviewPromptProps {
  customer: Customer;
  milestones: Milestone[];
  title?: string;
  message?: string;
  dismissLabel?: string;
  reviewLabel?: string;
  onReview?: () => void;
  reviewUrl: string; // URL to redirect for review submission
}

const ReviewPrompt: React.FC<ReviewPromptProps> = ({
  customer,
  milestones,
  title = "Enjoying our app?",
  message = "We’d love it if you could leave us a review!",
  dismissLabel = "Not Now",
  reviewLabel = "Leave a Review",
  onReview,
  reviewUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(
    null
  );

  const isMilestoneDismissed = (milestoneName: string, target: number) => {
    const dismissed = sessionStorage.getItem("dismissedMilestones");
    const dismissedList = dismissed ? JSON.parse(dismissed) : [];
    return dismissedList.some(
      (entry: { name: string; target: number }) =>
        entry.name === milestoneName && entry.target === target
    );
  };

  const markMilestoneAsDismissed = (milestoneName: string, target: number) => {
    const dismissed = sessionStorage.getItem("dismissedMilestones");
    const dismissedList = dismissed ? JSON.parse(dismissed) : [];
    dismissedList.push({ name: milestoneName, target });
    sessionStorage.setItem(
      "dismissedMilestones",
      JSON.stringify(dismissedList)
    );
  };

  useEffect(() => {
    // Exit if the user has already left a review
    if (customer.reviews.length > 0) {
      setIsOpen(false);
      return;
    }

    // Evaluate milestone state dynamically
    for (const milestone of milestones) {
      const { name, targets, source } = milestone;

      // Get the source value dynamically from the customer object
      const sourceValue = customer.customFields[source];

      for (const target of targets) {
        if (sourceValue >= target && !isMilestoneDismissed(name, target)) {
          setCurrentMilestone(milestone);
          setIsOpen(true);
          return;
        }
      }
    }
  }, [customer, milestones]);

  const handleDismiss = () => {
    if (currentMilestone) {
      const { name, source } = currentMilestone;
      const sourceValue = customer.customFields[source];
      markMilestoneAsDismissed(name, sourceValue);
    }
    setIsOpen(false);
  };

  const handleReview = () => {
    if (currentMilestone) {
      const { name, source } = currentMilestone;
      const sourceValue = customer.customFields[source];
      markMilestoneAsDismissed(name, sourceValue);
    }
    onReview?.();
    window.open(reviewUrl, "_blank");
    setIsOpen(false);
  };

  return (
    <Modal
      primaryAction={{
        content: reviewLabel,
        icon: ExternalIcon,
        external: true,
        onAction: handleReview,
      }}
      secondaryActions={[
        {
          content: dismissLabel,
          onAction: handleDismiss,
        },
      ]}
      size="large"
      open={isOpen}
      onClose={handleDismiss}
      title={title}
    >
      <Modal.Section>
        <Text as="p">{message}</Text>
      </Modal.Section>
    </Modal>
  );
};

export default ReviewPrompt;
