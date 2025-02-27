import LoadingIndicator from "../LoadingIndicator";

type LoadingViewProps = {
  size?: "small" | "medium" | "large";
  children?: React.ReactNode;
};

export default function LoadingView({
  size = "medium",
  children,
}: LoadingViewProps) {
  return (
    <div className="appear-animation bg-black-opacity-100 absolute z-40 flex h-full w-full flex-col items-center justify-center rounded-sm backdrop-blur-sm">
      <LoadingIndicator size={size} />
      {children}
    </div>
  );
}
