import React from "react";
import Cell from "./Cell";

export default function Canvas(props) {
  return (
    <div>
      <table
        style={{
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          {props.grid.map((row, j) => (
            <tr key={j}>
              {row.map((col, i) => (
                <Cell
                  x={i}
                  y={j}
                  key={`${i}${j}`}
                  type={props.grid[j][i]}
                  mark={props.mark}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
