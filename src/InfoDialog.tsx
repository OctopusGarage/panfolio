import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
export function InfoDialog({
  title,
  onClose,
  children,
  closeLabel,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  closeLabel: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = ref.current!;
    const trigger = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      className="info-dialog"
      ref={ref}
      aria-labelledby="info-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="dialog-heading">
        <h2 id="info-title">{title}</h2>
        <button onClick={onClose} aria-label={closeLabel}>
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
