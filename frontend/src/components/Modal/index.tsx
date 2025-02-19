import { JSX, useEffect } from "react";
/* import {} from 'react-icons/io5'; */

type ModalProps = {
  visible: boolean;
  children: (() => JSX.Element) | JSX.Element;
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
    const detectESCKey = (e) => {
      if (e.key === "Escape") {
        onDismiss();
      }
    };

    return () => {
      document.removeEventListener("keydown", detectESCKey);
    };
  });

  return (
    visible && (
      <div
        className={
          "appear-animation fixed top-0 right-0 bottom-0 left-0 overflow-auto p-4" +
          (containerClassName ? ` ${containerClassName}` : "")
        }
        style={containerStyle}
      >
        <div className="relative h-full w-full">
          <div
            className={
              "bg-secondaryBg scrollbar scrollbar-thumb-[#252525] scrollbar-track-[#1E1E1E] absolute top-1/2 left-1/2 z-30 h-full max-h-160 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-lg p-4" +
              (modalClassName ? ` ${modalClassName}` : "")
            }
            style={modalStyle}
          >
            {children}
          </div>
        </div>
        <div
          className={
            "fixed top-0 left-0 h-full w-full bg-[#000000b3]" +
            (bgClassName ? ` ${bgClassName}` : "")
          }
          onClick={onDismiss}
          style={bgStyle}
        />
      </div>
    )
  );
}
