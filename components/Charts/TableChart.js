import { Table, ScrollArea } from "@mantine/core";

export const TableChart = ({ data, columns }) => {
  const rows = data.map((element, index) => (
    <tr key={index}>
      {Object.values(element).map((v, i) => (
        <td key={i}>{v}</td>
      ))}
    </tr>
  ));

  const titles = (
    <tr>
      {Object.keys(columns).map((value) => (
        <th key={value}>{value}</th>
      ))}
    </tr>
  );

  return (
    <ScrollArea style={{ width: 768 }}>
      <Table striped>
        <thead>{titles}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
};
