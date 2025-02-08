import { ClassAttributes, ButtonHTMLAttributes } from "react";
import { JSX } from "react/jsx-runtime";
import "./styles.css";
import colors from "../../constants/colors";

export default function Button(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLButtonElement> &
    ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      className="button"
      style={{
        backgroundColor: colors.primary,
      }}
      {...props}
    >
      {props.children}
    </button>
  );
}
