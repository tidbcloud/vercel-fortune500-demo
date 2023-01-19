import { Table, createStyles } from "@mantine/core";

const useStyles = createStyles({
  headCell: {
    height: 50,
  },
  bodyCell: {
    padding: `10px !important`,
  },
});

export const TableChart = ({ data, columns }) => {
  const { classes } = useStyles();
  const rows = data.map((element, index) => (
    <tr key={index}>
      {Object.values(element).map((v, i) => (
        <td key={i} className={classes.bodyCell}>
          {v}
        </td>
      ))}
    </tr>
  ));

  const titles = (
    <tr>
      {Object.keys(columns).map((value) => (
        <th key={value} className={classes.headCell}>
          {value}
        </th>
      ))}
    </tr>
  );

  return (
    <Table striped withBorder>
      <thead>{titles}</thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};
