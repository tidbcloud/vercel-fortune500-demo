import EChartsReact from "echarts-for-react";
import { useMemo } from "react";
import { isTimeField } from "@/lib/utils";
import { BarChartInfo } from "@/lib/api";

export const BarChart: React.FC<{
  chartInfo: BarChartInfo;
  className?: string;
  data: any[];
}> = ({ chartInfo, data, className }) => {
  const {
    options: { x, y },
  } = chartInfo;

  const isTime = isTimeField(x);
  const isNotTime = !isTime;

  const { options, height } = useMemo(() => {
    const xAxisData = data.map((v) => v[x]);

    const makeSeries = function (y: string | string[]): any {
      if (typeof y === "string") {
        return {
          type: "bar",
          name: y,
          datasetId: "raw",
          data: data.map((v) => v[y]),
        };
      } else {
        return y.map(makeSeries);
      }
    };

    const series = makeSeries(y);

    return {
      options: {
        dataset: {
          id: "raw",
          source: data,
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLabel: {
            interval: 0,
            rotate: 30,
            fontSize: 10,
            overflow: "break",
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            fontSize: 10,
            interval: 0,
            width: 100,
          },
        },
        legend: {
          left: "center",
          top: 28,
        },
        grid: {
          containLabel: true,
          top: 64,
          left: 10,
          right: 10,
          bottom: 10,
        },
        series,
        tooltip: {
          trigger: "axis",
        },
        dataZoom: [
          {
            type: "inside",
            throttle: 50,
          },
        ],
        animationDuration: 2000,
      },
      height: 400,
    };
  }, [data, x, y]);

  return (
    <EChartsReact
      className={className}
      style={{ height }}
      opts={{ height }}
      option={options}
    ></EChartsReact>
  );
};
