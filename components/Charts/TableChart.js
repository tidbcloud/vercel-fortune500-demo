import { Table, ScrollArea } from "@mantine/core";
import style from "./TableChart.module.css";

export const TableChart = ({ data, columns }) => {
  const rows = data.map((element, index) => (
    <tr key={index}>
      {Object.values(element).map((v, i) => (
        <td key={i} className={style.tbody_tr_td}>
          {v}
        </td>
      ))}
    </tr>
  ));

  const titles = (
    <tr>
      {Object.keys(columns).map((value) => (
        <th key={value} className={style.thead_tr_th}>
          {value}
        </th>
      ))}
    </tr>
  );

  return (
    <ScrollArea style={{ width: 768 }}>
      <Table striped withBorder>
        <thead>{titles}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
};
