import Loading from "../../assets/img/Ripple.svg";

type LoadingIndicatorProps = {
  size?: "small" | "medium" | "large";
  style?: React.CSSProperties;
};

export default function LoadingIndicator({
  size,
  style,
}: LoadingIndicatorProps) {
  const sizes = {
    small: 32,
    medium: 48,
    large: 64,
  };

  return (
    <div
      className="flex justify-center items-center w-16"
      style={{
        width: sizes[size || "medium"],
        height: sizes[size || "medium"],
        ...style,
      }}
    >
      <img src={Loading} />
    </div>
  );
}
