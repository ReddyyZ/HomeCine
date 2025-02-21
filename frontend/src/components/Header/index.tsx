import Logo from "../Logo";

export default function Header() {
  return (
    <div className="flex justify-center bg-gray-600 px-4 py-2">
      <button className="cursor-pointer">
        <Logo size="small" />
      </button>
    </div>
  );
}
