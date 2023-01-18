import EChartsReact from "echarts-for-react";
import { useMemo } from "react";

export const BarChart = ({ chartInfo, data, className, columns }) => {
  const {
    options: { x, y },
    title,
  } = chartInfo;

  const chartOptions = useMemo(() => {
    const xAxisData = data.map((v) => v[x]);
    const series = (Array.isArray(y) ? y : [y]).map((field) => {
      return {
        data: data.map((v) => v[field]),
        type: "bar",
      };
    });

    return {
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: {
        type: "value",
      },
      series: series,
      tooltip: {
        trigger: "axis",
      },
    };
  }, []);

  return (
    <EChartsReact
      className={className}
      style={{
        height: 400,
      }}
      opts={{
        height: 400,
      }}
      option={chartOptions}
    ></EChartsReact>
  );
};
