import { Table } from "@mantine/core";

export const TableChart = ({ chartInfo, data, className, columns, fields }) => {
  const { title } = chartInfo;
  console.log(data);
  console.log("columns", columns);
  const rows = data.map((element) => (
    <tr key={element.name}>
      {Object.values(element).map((v) => (
        <td>{v}</td>
      ))}
    </tr>
  ));
  const titles = (
    <tr>
      {Object.values(columns).map((value) => (
        <th style={{ height: "60px", color: "#c4c4c4" }}>{value.col}</th>
      ))}
    </tr>
  );
  return (
    <div
      style={{
        padding: "0 20px 20px 20px",
        border: "1px solid rgba(89, 95, 236, 0.5) 0%",
        borderRadius: "3px",
      }}
    >
      <Table style={{ color: "#c4c4c4" }}>
        <thead style={{ backgroundColor: "black", weight: "700" }}>
          {titles}
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
};
