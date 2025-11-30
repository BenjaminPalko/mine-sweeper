import clsx from "clsx";
import { Bomb, FlagTriangleRight } from "lucide-react";
import type { Cell } from "../types";

function cellIcon(cell: Cell) {
  if (cell.mined) {
    return <Bomb />;
  } else if (cell.opened) {
    return cell.danger > 0 && <p>{cell.danger}</p>;
  } else if (cell.flagged) {
    return <FlagTriangleRight />;
  } else {
    return "";
  }
}

const CellButton = function ({
  cell,
  open,
  flag,
}: {
  cell: Cell;
  open: () => void;
  flag: () => void;
}) {
  return (
    <button
      className={clsx("btn btn-square rounded-none", {
        "btn-info": cell.flagged,
        "btn-neutral": cell.opened && !cell.mined,
        "btn-error": cell.mined,
      })}
      onClick={(e) => {
        e.preventDefault();
        open();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        flag();
      }}
    >
      {cellIcon(cell)}
    </button>
  );
};

export default CellButton;
