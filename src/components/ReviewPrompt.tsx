import { useEffect, useState } from "react";
import { Box, Button, InlineStack, Modal, Text } from "@shopify/polaris";
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
  reviewUrl: string;
  doNotAskLabel?: string;
  remindLaterLabel?: string;
  confirmLabel?: string;
}

const ReviewPrompt: React.FC<ReviewPromptProps> = ({
  customer,
  milestones,
  title = "Enjoying our app?",
  message = "We'd love it if you could leave us a review!",
  reviewLabel = "Leave a Review",
  onReview,
  reviewUrl,
  remindLaterLabel = "Remind me later",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
    const hasDismissed = localStorage.getItem("hideReviewPrompt");
    if (hasDismissed) {
      return;
    }

    if (customer.reviews.length > 0) {
      setIsOpen(false);
      return;
    }

    for (const milestone of milestones) {
      const { name, targets, source } = milestone;
      const sourceValue = customer.usage[source];

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
      const sourceValue = customer.usage[source];
      markMilestoneAsDismissed(name, sourceValue);
    }
    setIsOpen(false);
  };

  const handleReview = () => {
    if (currentMilestone) {
      const { name, source } = currentMilestone;
      const sourceValue = customer.usage[source];
      markMilestoneAsDismissed(name, sourceValue);
    }
    onReview?.();
    window.open(reviewUrl, "_blank");
    setIsOpen(false);
  };

  return (
    <Modal size="small" open={isOpen} onClose={handleDismiss} title={title}>
      <Modal.Section>
        <Box>
          <Text as="p" alignment="start">
            {message}
          </Text>
        </Box>
        <Box padding="200">
          <InlineStack align="end" gap="200" blockAlign="end" >
            <Button onClick={handleDismiss}>{remindLaterLabel}</Button>
            <Button
              variant="primary"
              icon={ExternalIcon}
              external
              onClick={handleReview}
            >
              {reviewLabel}
            </Button>
          </InlineStack>
        </Box>
      </Modal.Section>
    </Modal>
  );
};

export default ReviewPrompt;
