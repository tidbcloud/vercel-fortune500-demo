export function isTimeField(name) {
  return /date|time|year|month/.test(name);
}

export function isYearLike(value) {
  if (typeof value === "number") {
    return value >= 1970 && value < 2100;
  } else {
    return isYearLike(Number(value));
  }
}

export function transformTimeData(data, field) {
  return data.map((item) => {
    let value = item[field];
    if (isYearLike(value)) {
      value = new Date(String(value));
    }
    return { ...item, [field]: value };
  });
}

export function isNumberFiled(column) {
  return ["DECIMAL", "INT", "DOUBLE", "BIGINT"].includes(column.data_type);
}