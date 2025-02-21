import LoadingIndicator from "../LoadingIndicator";

type LoadingViewProps = {
  size?: "small" | "medium" | "large";
};

export default function LoadingView({ size = "medium" }: LoadingViewProps) {
  return (
    <div className="appear-animation bg-black-opacity-100 absolute z-40 flex h-full w-full items-center justify-center rounded-sm backdrop-blur-sm">
      <LoadingIndicator size={size} />
    </div>
  );
}
