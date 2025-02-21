import { ReactNode, useEffect, useRef, useState } from "react";
import { IoCaretDown, IoCaretUp } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

type DropdownMenuItemProps = {
  id: number;
  value: string;
};

interface DropdownMenuMainProps {
  items: DropdownMenuItemProps[];
  onSelect: (item: DropdownMenuItemProps) => void;
  btnStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  containerClassName?: React.HTMLAttributes<HTMLDivElement>["className"];
  itemsContainerStyle?: React.CSSProperties;
  itemsContainerClassName?: React.HTMLAttributes<HTMLDivElement>["className"];
  itemStyle?: React.CSSProperties;
  itemClassName?: React.HTMLAttributes<HTMLDivElement>["className"];
}

interface DropdownMenuSelectProps {
  select: boolean;
  currentItem: number;
  value?: never;
}

interface DropdownMenuNonSelectProps {
  select?: undefined;
  currentItem?: never;
  value: ReactNode;
}

type DropdownMenuProps = DropdownMenuMainProps &
  (DropdownMenuSelectProps | DropdownMenuNonSelectProps);

export default function DropdownMenu({
  items,
  onSelect,
  currentItem,
  btnStyle,
  containerStyle,
  containerClassName,
  itemsContainerStyle,
  itemsContainerClassName,
  itemStyle,
  itemClassName,
  select,
  value,
}: DropdownMenuProps) {
  const currentItemValue = items.find((item) => item.id === currentItem);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative" style={containerStyle}>
      <button
        style={btnStyle}
        className={twMerge(
          `flex w-[100%] cursor-pointer items-center justify-between bg-gray-600 px-4 py-2 text-white ${!select ? "transition-opacity duration-200 hover:opacity-70" : ""}`,
          containerClassName,
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {select ? currentItemValue?.value : value}
        {select &&
          (isOpen ? <IoCaretUp size={20} /> : <IoCaretDown size={20} />)}
      </button>

      {isOpen && (
        <div
          className={twMerge(
            `bg-cardBg absolute z-30 shadow-lg ${isOpen ? "" : "hidden"}`,
            itemsContainerClassName,
          )}
          style={itemsContainerStyle}
        >
          {isOpen &&
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
                className={twMerge(
                  `flex max-w-[100%] cursor-pointer p-2 break-all hover:bg-gray-300 ${currentItem === item.id ? "bg-gray-300" : ""}`,
                  itemClassName,
                )}
                style={itemStyle}
              >
                {item.value}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
