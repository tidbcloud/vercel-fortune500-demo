import EChartsReact from "echarts-for-react";
import { useMemo } from "react";

export const BarChart = (chartInfo, data, className) => {
  const chartOptions = useMemo(() => {
    return {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar",
        },
      ],
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
