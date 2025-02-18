import Logo from "../Logo";

export default function Header() {
  return (
    <div className="bg-secondaryBg flex justify-center px-4 py-2">
      <button className="cursor-pointer">
        <Logo size="small" />
      </button>
    </div>
  );
}
