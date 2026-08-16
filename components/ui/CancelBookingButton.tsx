"use client";

import { Button } from "@/components/ui/Button";

export function CancelBookingButton({
  onConfirm,
  loading,
}: {
  onConfirm: () => void;
  loading: boolean;
}) {
  function handleClick() {
    if (confirm("Cancel this booking? This can't be undone.")) {
      onConfirm();
    }
  }

  return (
    <Button variant="secondary" onClick={handleClick} disabled={loading}>
      Cancel booking
    </Button>
  );
}
