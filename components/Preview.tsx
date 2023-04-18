import {
  Table,
  Input,
  createStyles,
  ScrollArea,
  Skeleton,
  Loader,
} from "@mantine/core";
import { ColumnDescription } from "@/lib/api";
import { useMemoizedFn } from "ahooks";
import { useRef } from "react";

const useStyles = createStyles({
  table: {
    borderRadius: 8,
    borderCollapse: "initial",
    overflow: "hidden",

    "& thead tr th": {
      height: 50,
    },
    "& thead tr th:nth-of-type(1)": {
      width: 140,
    },
    "& thead tr th:nth-of-type(2)": {
      width: 140,
    },
  },
});

export const FilePreview: React.FC<{
  columns: ColumnDescription[];
  onChange?: (columns: ColumnDescription[]) => void;
  onRowChange?: (column: ColumnDescription) => void;
  loading?: boolean;
}> = ({ columns, onChange, loading, onRowChange }) => {
  const { classes } = useStyles();

  const handleChange = useMemoizedFn(
    (val: ColumnDescription, index: number) => {
      if (columns) {
        onChange?.([
          ...columns.slice(0, index),
          val,
          ...columns.slice(index + 1),
        ]);

        onRowChange?.(val);
      }
    }
  );

  return (
    <div>
      <ScrollArea h={500}>
        <Table cellSpacing={0} className={classes.table}>
          <thead>
            <tr>
              <th>Column</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((c, index) =>
              c.isLoading ? (
                <RowPlaceholder key={index} />
              ) : (
                <Row
                  key={c.column}
                  data={c}
                  index={index}
                  onChange={handleChange}
                />
              )
            )}
          </tbody>
        </Table>
      </ScrollArea>

      {loading && (
        <Loader size="xs" sx={{ position: "absolute", top: 5, right: 0 }} />
      )}
    </div>
  );
};

function RowPlaceholder() {
  return (
    <tr>
      <td>
        <Skeleton height={36} />
      </td>
      <td>
        <Skeleton height={36} />
      </td>
      <td>
        <Skeleton height={36} />
      </td>
    </tr>
  );
}

function Row({
  data,
  onChange,
  index,
}: {
  onChange: (v: ColumnDescription, i: number) => void;
  index: number;
  data: ColumnDescription;
}) {
  const isEditedRef = useRef(false);
  return (
    <tr>
      <td>{data.column || `unnamed_${index}`}</td>
      <td>{data.type.toUpperCase()}</td>
      <td>
        <Input
          styles={(theme) => ({
            input: {
              borderColor: "transparent",
              backgroundColor: theme.colors.gray[1],
            },
          })}
          type="text"
          defaultValue={data.description}
          onBlur={(e) => {
            if (isEditedRef.current) {
              onChange({ ...data, description: e.target.value }, index);
            }
          }}
          onChange={() => {
            isEditedRef.current = true;
          }}
        />
      </td>
    </tr>
  );
}
