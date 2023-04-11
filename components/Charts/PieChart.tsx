import { PieChartInfo } from "@/lib/api";
import EChartsReact from "echarts-for-react";
import { useMemo } from "react";

export const PieChart: React.FC<{
  chartInfo: PieChartInfo;
  className?: string;
  data: any[];
}> = ({ chartInfo, data, className }) => {
  const {
    options: { label, value },
  } = chartInfo;

  const option = useMemo(() => {
    const seriesData = data.map((v) => {
      return { value: v[value], name: v[label] };
    });

    return {
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "50%",
          data: seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  }, [data, label, value]);

  return (
    <EChartsReact
      className={className}
      style={{
        height: 400,
      }}
      opts={{
        height: 400,
      }}
      option={option}
    ></EChartsReact>
  );
};
