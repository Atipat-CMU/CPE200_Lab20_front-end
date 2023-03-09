import React from "react";

export default function Cell(props) {
  return (
    <td
      draggable="true"
      style={{
        width: "5rem",
        height: "5rem",
        cursor: "pointer",
        border: "1px solid",
        fontSize: "32px",
        textAlign: "center",
      }}
      onClick={() => props.mark(props.x, props.y)}
      //   onDragEnter={() => paint(x, y)}
    >
      {props.type}
    </td>
  );
}
