import { Table, createStyles } from "@mantine/core";
import { isNumberFiled } from "@/lib/utils";
import { ColumnInfo } from "@/lib/api";

const useStyles = createStyles({
  table: {
    borderRadius: 8,
    borderCollapse: "initial",
    overflow: "hidden",
  },
  headCell: {
    height: 50,
  },
  bodyCell: {
    padding: `10px !important`,
  },
});

export const TableChart: React.FC<{
  data: any[];
  columns: Record<string, ColumnInfo>;
}> = ({ data, columns }) => {
  console.log("columns: ", columns);
  console.log("data: ", data);
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
          {isNumberFiled(columns[k].data_type)
            ? Number(v).toLocaleString("en-US")
            : (v as any)}
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
