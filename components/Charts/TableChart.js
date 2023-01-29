import { Table, createStyles } from "@mantine/core";
import { isNumberFiled } from "./utils";

const useStyles = createStyles({
  table: {
    borderRadius: 8,
    borderCollapse: 'initial',
    overflow: 'hidden',
  },
  headCell: {
    height: 50,
  },
  bodyCell: {
    padding: `10px !important`,
  },
});

export const TableChart = ({ data, columns }) => {
  const { classes } = useStyles();

  const titles = (
    <tr>
      {Object.keys(columns).map((value) => (
        <th key={value} className={classes.headCell}>
          {value}
        </th>
      ))}
    </tr>
  );

  const rows = data.map((element, index) => (
    <tr key={index}>
      {Object.entries(element).map(([k, v], i) => (
        <td key={i} className={classes.bodyCell}>
          {isNumberFiled(columns[k]) ? Number(v).toLocaleString("en-US") : v}
        </td>
      ))}
    </tr>
  ));

  return (
    <Table striped withBorder cellSpacing={0} className={classes.table}>
      <thead>{titles}</thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};
