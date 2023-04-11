import {
  Table,
  Input,
  createStyles,
  ScrollArea,
  Stack,
  Button,
  Group,
  Alert,
} from "@mantine/core";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";
import { IconAlertCircle } from "@tabler/icons";
import { ColumnDescription } from "@/lib/api";

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
  columns: any[];
  name: string;
  content: string;
  onCancel: () => void;
}> = ({ columns, name, content, onCancel }) => {
  const { classes } = useStyles();
  const ref = useRef(columns);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const [text, setText] = useState("Submit");
  const router = useRouter();

  const onChange = useCallback((val: ColumnDescription, index: number) => {
    ref.current[index] = val;
  }, []);

  const onSubmit = () => {
    setLoading(true);
    setError("");
    fetch(`/api/upload`, {
      method: "POST",
      body: JSON.stringify({
        filename: name,
        columns: columns,
        content: content,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.data?.id) {
          setText("Redirecting...");
          return router.push(`/search?id=${res.data.id}`);
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Stack>
      <ScrollArea h={600}>
        <Table withBorder cellSpacing={0} className={classes.table}>
          <thead>
            <tr>
              <th>Column</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((c, index) => (
              <Row key={c.column} data={c} index={index} onChange={onChange} />
            ))}
          </tbody>
        </Table>
      </ScrollArea>

      {err && (
        <Alert title="Error" color="red" icon={<IconAlertCircle size={16} />}>
          {err}
        </Alert>
      )}

      <Group position="center">
        <Button variant="default" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} loading={loading}>
          {text}
        </Button>
      </Group>
    </Stack>
  );
};

function Row({
  data,
  onChange,
  index,
}: {
  onChange: (v: ColumnDescription, i: number) => void;
  index: number;
  data: ColumnDescription;
}) {
  return (
    <tr key={data.column}>
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
          onChange={(e) => {
            onChange({ ...data, description: e.target.value }, index);
          }}
        />
      </td>
    </tr>
  );
}
