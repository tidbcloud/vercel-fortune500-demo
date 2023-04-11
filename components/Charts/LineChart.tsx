import { useMemo } from "react";
import EChartsReact from "echarts-for-react";
import {
  isNumberFiled,
  isNumeric,
  isTimeField,
  transformTimeData,
} from "@/lib/utils";
import { LineChartInfo } from "@/lib/api";

function sortDataForXAxis(data: any[], x: string) {
  if (isNumberFiled(x) || data.map((i) => i[x]).every((j) => isNumeric(j))) {
    data.sort((a, b) => Number(a[x]) - Number(b[x]));
  }
  return data;
}

export const LineChart: React.FC<{
  chartInfo: LineChartInfo;
  className?: string;
  data: any[];
}> = ({ chartInfo, data, className }) => {
  const {
    options: { x, y },
    title,
  } = chartInfo;

  const chartOptions = useMemo(() => {
    let _data = sortDataForXAxis(data, x);
    const isTime = isTimeField(x);
    const source = isTime ? transformTimeData(_data, x) : _data;

    const makeSeries = function (y: string | string[]): any {
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
