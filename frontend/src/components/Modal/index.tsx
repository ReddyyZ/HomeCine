import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

type ModalProps = {
  visible: boolean;
  children: React.ReactNode;
  onDismiss: () => void;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  bgClassName?: string;
  bgStyle?: React.CSSProperties;
  modalClassName?: string;
  modalStyle?: React.CSSProperties;
};

export default function Modal({
  visible,
  children,
  onDismiss,
  containerStyle,
  containerClassName,
  bgStyle,
  bgClassName,
  modalStyle,
  modalClassName,
}: ModalProps) {
  useEffect(() => {
    const detectESCKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onDismiss();
      }
    };

    document.addEventListener("keydown", detectESCKey);

    return () => {
      document.removeEventListener("keydown", detectESCKey);
    };
  });

  return (
    visible && (
      <div
        className={twMerge(
          "appear-animation fixed top-0 right-0 bottom-0 left-0 overflow-auto p-4",
          containerClassName,
        )}
        style={containerStyle}
      >
        <div className="relative h-full w-full">
          <div
            className={twMerge(
              "absolute top-1/2 left-1/2 z-30 h-full max-h-160 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-gray-600 p-3",
              modalClassName,
            )}
            style={modalStyle}
          >
            <div className="scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-600 h-full w-full overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
        <div
          className={twMerge(
            "bg-black-opacity fixed top-0 left-0 h-full w-full",
            bgClassName,
          )}
          onClick={onDismiss}
          style={bgStyle}
        />
      </div>
    )
  );
}
