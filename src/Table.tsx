import React, { FC } from "react";

interface TableProps {
  headers: any[];
  cells: any[];
}

export let Table: FC<TableProps> = ({ headers, cells }) => {
  return (
    <table style={{ textAlign: "left" }}>
      <tbody>
        {headers.map((header, index) => {
          return (
            <tr key={header}>
              <th>{header}</th>

              <td style={{ paddingLeft: 10 }}>{cells[index]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
