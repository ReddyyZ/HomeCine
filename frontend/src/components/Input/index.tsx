import { ClassAttributes, InputHTMLAttributes } from "react";
import { JSX } from "react/jsx-runtime";
import colors from "../../constants/colors";
import "./styles.css";

export default function Input(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLInputElement> &
    InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      style={{
        backgroundColor: colors.cardBg,
        color: colors.text,
      }}
      className="input"
      {...props}
    />
  );
}
