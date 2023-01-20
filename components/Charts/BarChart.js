import EChartsReact from "echarts-for-react";
import { useMemo } from "react";
import { isTimeField } from "@/components/Charts/utils";

export const BarChart = ({ chartInfo, data, className }) => {
  const {
    options: { x, y },
  } = chartInfo;

  const isTime = isTimeField(x);
  const isNotTime = !isTime;

  const { options, height } = useMemo(() => {
    const xAxisData = data.map((v) => v[x]);

    const makeSeries = function (y) {
      if (typeof y === "string") {
        return {
          type: "bar",
          data: data.map((v) => v[y]),
        };
      } else {
        return y.map(makeSeries);
      }
    };

    return {
      options: {
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
        grid: {
          containLabel: true,
          left: 10,
          right: 10,
          bottom: 10,
        },
        series: makeSeries(y),
        tooltip: {
          trigger: "axis",
        },
        animationDuration: 2000,
      },
      height: Math.max(isNotTime ? 40 * data.length : 400, 400),
    };
  }, [data, x, y, isNotTime]);

  return (
    <EChartsReact
      className={className}
      style={{
        height,
      }}
      opts={{
        height,
      }}
      option={options}
    ></EChartsReact>
  );
};
