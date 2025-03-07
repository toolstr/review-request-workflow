import { useState, useEffect } from "react";
import { Customer, Milestone } from "../index";

export const getSourceValue = (customer: Customer, source: string) => {
  return customer?.usage?.[source]?.allTimeValue;
};

interface UseReviewPromptOptions {
  customer: Customer;
  milestones: Milestone[];
}

export const useReviewPrompt = ({
  customer,
  milestones,
}: UseReviewPromptOptions) => {
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
    
    // Check if milestone with same name and target already exists
    const exists = dismissedList.some(
      (entry: { name: string; target: number }) =>
        entry.name === milestoneName && entry.target === target
    );
    
    // Only add if it doesn't exist
    if (!exists) {
      dismissedList.push({ name: milestoneName, target });
      sessionStorage.setItem(
        "dismissedMilestones",
        JSON.stringify(dismissedList)
      );
    }
  };

  useEffect(() => {
    if (customer.reviews.length > 0) {
      setIsOpen(false);
      return;
    }

    for (const milestone of milestones) {
      const { name, targets, source } = milestone;

      const sourceValue = getSourceValue(customer, source);

      for (const target of targets) {
        if (sourceValue >= target && !isMilestoneDismissed(name, target)) {
          setCurrentMilestone(milestone);
          setIsOpen(true);
          return;
        }
      }
    }
  }, [customer, milestones]);

  const dismissPrompt = () => {
    if (currentMilestone) {
      const { name, source } = currentMilestone;
      const sourceValue = getSourceValue(customer, source);
      markMilestoneAsDismissed(name, sourceValue);
    }
    setIsOpen(false);
  };

  const reviewPrompt = () => {
    if (currentMilestone) {
      const { name, source } = currentMilestone;
      const sourceValue = getSourceValue(customer, source);
      markMilestoneAsDismissed(name, sourceValue);
    }
    setIsOpen(false);
  };

  return {
    isOpen,
    currentMilestone,
    dismissPrompt,
    reviewPrompt,
  };
};
