import { ClassAttributes, BaseHTMLAttributes, JSX } from "react";
import { GoCheckCircle, GoAlert, GoInfo, GoXCircle } from "react-icons/go";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  children: string;
  color?: "success" | "error" | "warning" | "info";
  style?: JSX.IntrinsicElements["div"]["style"];
}

export default function Alert({ type, color, children, style }: AlertProps) {
  const colors = {
    success: "#2ECC71",
    error: "#E74C3C",
    warning: "#F39C12",
    info: "#3498DB",
  };
  const bgColors = {
    success: "rgba(209, 242, 235, 0.1)",
    error: "rgba(250, 219, 216, 0.1)",
    warning: "rgba(253, 235, 208, 0.1)",
    info: "rgba(214, 234, 248, 0.1)",
  };

  const selectedColor = color ? colors[color] : colors[type];
  const bgColor = color ? bgColors[color] : bgColors[type];

  return (
    <div
      style={{
        backgroundColor: bgColor,
        width: "100%",
        ...style,
      }}
      className="p-4 rounded-md"
    >
      <div className="flex items-center" style={{ color: selectedColor }}>
        {type === "success" && <GoCheckCircle fill={selectedColor} size={24} />}
        {type === "error" && <GoXCircle fill={selectedColor} size={24} />}
        {type === "warning" && <GoAlert fill={selectedColor} size={24} />}
        {type === "info" && <GoInfo fill={selectedColor} size={24} />}
        <p className="ml-2" style={{ color: selectedColor }}>
          {children}
        </p>
      </div>
    </div>
  );
}
