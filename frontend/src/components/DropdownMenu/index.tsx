import { ReactNode, useState } from "react";
import { IoCaretDown, IoCaretUp } from "react-icons/io5";

type DropdownMenuItemProps = {
  id: number;
  value: string;
};

interface DropdownMenuMainProps {
  items: DropdownMenuItemProps[];
  onSelect: (item: DropdownMenuItemProps) => void;
  btnStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  itemsContainerStyle?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
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
  itemsContainerStyle,
  itemStyle,
  select,
  value,
}: DropdownMenuProps) {
  const currentItemValue = items.find((item) => item.id === currentItem);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" style={containerStyle}>
      <button
        style={btnStyle}
        className={`flex w-[100%] cursor-pointer items-center justify-between bg-[#1e1e1e] px-4 py-2 text-white ${!select ? "transition-opacity duration-200 hover:opacity-70" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {select ? currentItemValue?.value : value}
        {select &&
          (isOpen ? <IoCaretUp size={20} /> : <IoCaretDown size={20} />)}
      </button>

      {isOpen && (
        <div
          className={`bg-cardBg absolute z-30 w-[100%] shadow-lg ${isOpen ? "" : "hidden"}`}
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
                className={`flex max-w-[100%] cursor-pointer p-2 break-all hover:bg-[#3a3a3a] ${currentItem === item.id ? "bg-[#3a3a3a]" : ""}`}
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
