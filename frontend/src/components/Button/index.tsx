import { ClassAttributes, InputHTMLAttributes } from "react";
import { JSX } from "react/jsx-runtime";
import "./styles.css";
import colors from "../../constants/colors";

export default function Button(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLInputElement> &
    InputHTMLAttributes<HTMLInputElement>,
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
