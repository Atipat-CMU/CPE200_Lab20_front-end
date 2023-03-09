import React from "react";

export default function Board() {
  const [colorGrid, setColorGrid] = useState([[]]);

  return (
    <div>
      <table
        style={{
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          {colorGrid.map((row, j) => (
            <tr key={j}>
              {row.map((col, i) => (
                <Cell
                  x={i}
                  y={j}
                  key={`${i}${j}`}
                  paint={paint}
                  color={colorGrid[j][i]}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
