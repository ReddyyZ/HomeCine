import { InputHTMLAttributes, useState, TextareaHTMLAttributes } from "react";
import colors from "../../constants/colors";
import "./styles.css";
import { IoSearch, IoEye, IoEyeOff } from "react-icons/io5";
import { IconBaseProps } from "react-icons";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeText: (value: string) => void;
  type?: "text" | "password" | "email" | "search";
  onSearch?: (value: string) => void;
  multipleLine?: boolean;
}

interface PasswordInputIcon extends IconBaseProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  disabled?: boolean;
}

interface SearchIconProps extends IconBaseProps {
  disabled?: boolean;
}

const PasswordInputIcon = ({
  visible,
  setVisible,
  ...props
}: PasswordInputIcon) => {
  return (
    <button disabled={props.disabled} onClick={() => setVisible(!visible)}>
      {visible ? <IoEye {...props} /> : <IoEyeOff {...props} />}
    </button>
  );
};

export default function Input({
  type,
  onChangeText,
  value,
  onSearch,
  multipleLine,
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
  const SearchIcon = (props: SearchIconProps) => (
    <button
      disabled={props.disabled}
      onClick={() => onSearch && onSearch(value)}
      className={value.length ? "cursor-pointer" : ""}
      type="submit"
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
      className={`input`}
    >
      {!multipleLine ? (
        <>
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
                disabled={!value.length}
              />
            </div>
          )}
        </>
      ) : (
        <textarea
          className={
            "scrollbar scrollbar-thumb-[#3A3A3A] scrollbar-track-[#252525] min-h-48 w-full resize-none bg-transparent p-2" +
            (props.className ? ` ${props.className}` : "")
          }
          // {...props}
          onChange={(e) => onChangeText(e.target.value)}
        />
      )}
    </div>
  );
}
