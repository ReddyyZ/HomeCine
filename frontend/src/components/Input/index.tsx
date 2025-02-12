import { InputHTMLAttributes, useState } from "react";
import colors from "../../constants/colors";
import "./styles.css";
import { IoSearch, IoEye, IoEyeOff } from "react-icons/io5";
import { IconBaseProps } from "react-icons";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeText: (value: string) => void;
  type?: "text" | "password" | "email" | "search";
  onSearch?: (value: string) => void;
}

interface PasswordInputIcon extends IconBaseProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const PasswordInputIcon = ({
  visible,
  setVisible,
  ...props
}: PasswordInputIcon) => {
  return (
    <button onClick={() => setVisible(!visible)}>
      {visible ? <IoEye {...props} /> : <IoEyeOff {...props} />}
    </button>
  );
};

export default function Input({
  type,
  onChangeText,
  value,
  onSearch,
  ...props
}: InputProps) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const PasswordIcon = (props: IconBaseProps) => (
    <PasswordInputIcon
      visible={isPasswordVisible}
      setVisible={(visible) => setPasswordVisible(visible)}
      {...props}
    />
  );
  const SearchIcon = (props: IconBaseProps) => (
    <button
      onClick={() => onSearch && onSearch(value)}
      className={value.length ? "cursor-pointer" : ""}
    >
      <IoSearch {...props} />
    </button>
  );

  const Icon =
    type === "search"
      ? SearchIcon
      : type === "password"
        ? value.length
          ? PasswordIcon
          : null
        : null;

  return (
    <div
      style={{
        backgroundColor: colors.cardBg,
        color: colors.text,
      }}
      className="input"
    >
      <input
        style={{
          backgroundColor: colors.cardBg,
          color: colors.text,
        }}
        // className="input"
        type={
          type === "password"
            ? isPasswordVisible
              ? "text"
              : "password"
            : type === "email"
              ? "email"
              : "text"
        }
        onChange={(e) => onChangeText(e.target.value)}
        {...props}
      />
      {Icon && (
        <div className="flex items-center justify-center p-2">
          <Icon
            size={24}
            fill={colors.text}
            style={{
              opacity: value.length ? 1 : 0.6,
              transition: "opacity 0.2s",
            }}
          />
        </div>
      )}
    </div>
  );
}
