import { InputHTMLAttributes, useState, useEffect, useRef, memo } from "react";
import colors from "../../constants/colors";
import { IoSearch, IoEye, IoEyeOff } from "react-icons/io5";
import { IconBaseProps } from "react-icons";
import { twMerge } from "tailwind-merge";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeText: (value: string) => void;
  type?: "text" | "password" | "email" | "search";
  onSearch?: (value: string) => void;
  multipleLine?: boolean;
  error?: boolean;
}

interface PasswordInputIcon extends IconBaseProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  disabled?: boolean;
}

interface SearchIconProps extends IconBaseProps {
  disabled?: boolean;
}

const PasswordInputIcon = memo(
  ({ visible, setVisible, ...props }: PasswordInputIcon) => {
    return (
      <button disabled={props.disabled} onClick={() => setVisible(!visible)}>
        {visible ? <IoEye {...props} /> : <IoEyeOff {...props} />}
      </button>
    );
  },
);

export default function Input({
  type,
  onChangeText,
  value,
  onSearch,
  multipleLine,
  error,
  ...props
}: InputProps) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const PasswordIcon = memo((props: IconBaseProps) => (
    <PasswordInputIcon
      visible={isPasswordVisible}
      setVisible={(visible) => setPasswordVisible(visible)}
      {...props}
    />
  ));
  const SearchIcon = memo((props: SearchIconProps) => (
    <button
      disabled={props.disabled}
      onClick={() => onSearch && onSearch(value)}
      className={value.length ? "cursor-pointer" : ""}
      type="submit"
    >
      <IoSearch {...props} />
    </button>
  ));

  const Icon =
    type === "search"
      ? SearchIcon
      : type === "password"
        ? value.length
          ? PasswordIcon
          : null
        : null;

  useEffect(() => {
    if (multipleLine && textareaRef.current) {
      textareaRef.current.value = value;
    } else if (inputRef.current) {
      inputRef.current.value = value;
    }
  }, [value]);

  return (
    <div
      style={{
        backgroundColor: colors.cardBg,
        color: colors.text,
      }}
      className={twMerge(
        "flex w-full rounded-sm border border-gray-300 text-base placeholder-gray-200 transition-colors duration-200 focus-within:border-gray-200",
        error ? "border-error focus-within:border-error" : "",
        props.className,
      )}
    >
      {!multipleLine ? (
        <>
          <input
            style={{
              backgroundColor: colors.cardBg,
              color: colors.text,
            }}
            ref={inputRef}
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
            className="w-full rounded-sm p-3"
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
          className={twMerge(
            "scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-500 min-h-48 w-full resize-none bg-transparent p-2",
            props.className,
          )}
          // {...props}
          ref={textareaRef}
          onChange={(e) => onChangeText(e.target.value)}
        />
      )}
    </div>
  );
}
