import { ClassAttributes, ButtonHTMLAttributes } from "react";
import { JSX } from "react/jsx-runtime";
import "./styles.css";
import colors from "../../constants/colors";
import { twMerge } from "tailwind-merge";

export default function Button(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLButtonElement> &
    ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      {...props}
      className={twMerge("button", props.className)}
      style={{
        backgroundColor: colors.primary,
        ...props.style,
      }}
    >
      {props.children}
    </button>
  );
}
