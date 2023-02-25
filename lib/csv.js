import { parse as _parse } from "csv-parse";

export function parse(content) {
  return new Promise((resolve, reject) => {
    _parse(
      content,
      {
        skip_empty_lines: true,
        info: true,
      },
      function (err, records) {
        if (err) {
          reject(err);
        }
        const columns = records[0].record;
        const data = records.slice(1).map((i) => i.record);
        resolve([columns, data]);
      }
    );
  });
}
