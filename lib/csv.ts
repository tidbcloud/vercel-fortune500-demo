import { parse as _parse, Options } from "csv-parse";

export function parse(
  content: string,
  options?: Options
): Promise<[any[], any[]]> {
  return new Promise((resolve, reject) => {
    _parse(
      content,
      {
        skip_empty_lines: true,
        info: true,
        delimiter: [","],
        ...options,
      },
      function (err, records) {
        if (err || !records || !records?.length) {
          reject(err || "No data");
          return;
        }
        const columns = records[0].record;
        const data = records.slice(1).map((i: any) => i.record);
        resolve([columns, data]);
      }
    );
  });
}
