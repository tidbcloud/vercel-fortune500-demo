import { useMemo } from "react";
import EChartsReact from "echarts-for-react";
import { isTimeField, transformTimeData } from "./utils";

export const LineChart = ({ chartInfo, data, className }) => {
  const {
    options: { x, y },
    title,
  } = chartInfo;

  const chartOptions = useMemo(() => {
    const isTime = isTimeField(x);
    const source = isTime ? transformTimeData(data, x) : data;

    const makeSeries = function (y) {
      if (typeof y === "string") {
        return {
          type: "line",
          datasetId: "raw",
          name: y,
          encode: {
            x,
            y,
          },
          itemStyle: {
            opacity: 0,
          },
        };
      } else {
        return y.map(makeSeries);
      }
    };

    return {
      dataset: {
        id: "raw",
        source,
      },
      // backgroundColor: "rgb(36, 35, 43)",
      grid: {
        top: 64,
        left: 8,
        right: 8,
        bottom: 8,
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        left: "center",
        top: 28,
      },
      series: makeSeries(y),
      title: {
        text: title,
      },
      xAxis: {
        type: isTime ? "time" : "category",
      },
      yAxis: {
        type: "value",
      },
      animationDuration: 2000,
    };
  }, [title, x, y, data]);

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
    />
  );
};
