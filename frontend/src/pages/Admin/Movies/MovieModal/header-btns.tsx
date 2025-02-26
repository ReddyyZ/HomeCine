import { IoClose } from "react-icons/io5";
import Button from "../../../../components/Button";
import colors from "../../../../constants/colors";

interface HeaderBtnsProps {
  onDismiss: () => void;
  hasChanged: boolean;
  onDiscardChanges: () => void;
  saveChanges: () => void;
}

export default function HeaderBtns(props: HeaderBtnsProps) {
  return (
    <div className="flex justify-between">
      <button
        className="cursor-pointer transition-opacity hover:opacity-70"
        onClick={props.onDismiss}
      >
        <IoClose size={28} />
      </button>
      <div className="flex w-72 gap-2">
        <Button
          style={{
            backgroundColor: "#252525",
            color: !props.hasChanged ? "#3A3A3A" : "",
          }}
          className={
            !props.hasChanged ? "cursor-default! hover:opacity-100!" : ""
          }
          disabled={!props.hasChanged}
          onClick={props.onDiscardChanges}
        >
          Discard changes
        </Button>
        <Button
          onClick={props.saveChanges}
          style={{
            backgroundColor: !props.hasChanged ? "#252525" : colors.primary,
            color: !props.hasChanged ? "#3A3A3A" : "",
          }}
          className={
            !props.hasChanged ? "cursor-default! hover:opacity-100!" : ""
          }
          disabled={!props.hasChanged}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
