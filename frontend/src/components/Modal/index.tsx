import { useEffect } from "react";
/* import {} from 'react-icons/io5'; */

type ModalProps = {
  visible: boolean;
  children: () => JSX.Element | React.Node;
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
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    document.addEventListener("keydown", detectESCKey);

    return () => document.removeEventListener("keydown", detectESCKey);
  });

  return (
    visible && (
      <div
        className={
          "appear-animation p-4" +
          (containerClassName ? ` ${containerClassName}` : "")
        }
        style={containerStyle}
      >
        <div
          className={
            "absolute top-0 left-0 h-full w-full bg-[#000000b3]" +
            (bgClassName ? ` ${bgClassName}` : "")
          }
          onClick={onDismiss}
          style={bgStyle}
        />
        <div
          className={
            "bg-secondaryBg absolute top-1/2 left-1/2 h-full max-h-160 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 transform rounded-lg p-4" +
            (modalClassName ? ` ${modalClassName}` : "")
          }
          style={modalStyle}
        >
          {children}
        </div>
      </div>
    )
  );
}
