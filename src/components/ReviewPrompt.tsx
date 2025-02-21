import { useEffect, useState } from "react";
import { Modal, Text, Checkbox, Button } from "@shopify/polaris";
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
  doNotAskLabel = "Do not ask again",
  remindLaterLabel = "Remind me later",
  confirmLabel = "Confirm",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(
    null
  );
  const [doNotAsk, setDoNotAsk] = useState<boolean>(false);

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

  const handleDoNotAskAgain = () => {
    if (doNotAsk) {
      localStorage.setItem("hideReviewPrompt", "true");
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
    <Modal size="large" open={isOpen} onClose={handleDismiss} title={title}>
      <Modal.Section>
        <div style={{ textAlign: "left" }}>
          <Text as="p">{message}</Text>
          <Checkbox
            label={doNotAskLabel}
            checked={doNotAsk}
            onChange={(newChecked) => setDoNotAsk(newChecked)}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <Button onClick={handleDismiss}>{remindLaterLabel}</Button>
          <Button onClick={handleDoNotAskAgain} disabled={!doNotAsk}>
            {confirmLabel}
          </Button>
          <Button
            variant="primary"
            icon={ExternalIcon}
            external
            onClick={handleReview}
          >
            {reviewLabel}
          </Button>
        </div>
      </Modal.Section>
    </Modal>
  );
};

export default ReviewPrompt;
