import { useEffect, useState } from "react";
import { Box, Button, InlineStack, Modal, Text } from "@shopify/polaris";
import { ExternalIcon } from "@shopify/polaris-icons";
import { Customer, Milestone } from "../index";
import { getSourceValue } from "../hooks/useReviewPrompt";

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



const logger = (...args: unknown[]) => {
  const isDebug = localStorage.getItem('__TOOLSTR__TEAM_DEBUG__');
  if (isDebug) { 
    console.log(`[ReviewPrompt]`, ...args);
  }
};

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
 // Check if any higher or equal target was dismissed for this milestone
    return dismissedList.some(
      (entry: { name: string; target: number }) =>
        entry.name === milestoneName && entry.target >= target
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
      const sourceValue = getSourceValue(customer, source);
      const isTargetMet = targets.some(target => 
        sourceValue >= target && !isMilestoneDismissed(name, target)
      );
      logger(`isTargetMet: source: ${source}, sourceValue: ${sourceValue}, targets: ${targets.join(", ")}, isTargetMet: ${isTargetMet}`);

      if (isTargetMet) {
        setCurrentMilestone(milestone);
        setIsOpen(true);
        break;
      }
    }
  }, [customer, milestones]);

  const handleDismiss = () => {
    if (currentMilestone) {
      const { name, source } = currentMilestone;
      const sourceValue = getSourceValue(customer, source);
      markMilestoneAsDismissed(name, sourceValue);
    }
    setIsOpen(false);
  };

  const handleReview = () => {
    if (currentMilestone) {
      const { name, source } = currentMilestone;
      const sourceValue = getSourceValue(customer, source);
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
