import { useState } from "react";
import Button from "../Button";
import { IoCaretDown, IoCaretUp } from "react-icons/io5";

type DropdownMenuItemProps = {
  id: number;
  value: string;
};

type DropdownMenuProps = {
  items: DropdownMenuItemProps[];
  onSelect: (item: DropdownMenuItemProps) => void;
  currentItem: number;
  btnStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  itemsContainerStyle?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
};

export default function DropdownMenu({
  items,
  onSelect,
  currentItem,
  btnStyle,
  containerStyle,
  itemsContainerStyle,
  itemStyle,
}: DropdownMenuProps) {
  const currentItemValue = items.find((item) => item.id === currentItem);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" style={containerStyle}>
      <button
        className="flex w-[100%] cursor-pointer items-center justify-between bg-[#1e1e1e] px-4 py-2 text-white"
        onClick={() => setIsOpen(!isOpen)}
        style={btnStyle}
      >
        {currentItemValue?.value}
        {isOpen ? <IoCaretUp size={20} /> : <IoCaretDown size={20} />}
      </button>

      {isOpen && (
        <div
          className={`bg-cardBg absolute z-30 w-[100%] rounded-lg shadow-lg ${isOpen ? "" : "hidden"}`}
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
                className={`cursor-pointer p-2 hover:bg-[#3a3a3a] ${currentItem === item.id ? "bg-[#3a3a3a]" : ""}`}
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
