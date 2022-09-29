import { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const useChart = (chartOptions) => {
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef.current) {
      var chart = new ApexCharts(chartRef.current, chartOptions);
      chart?.render();
    }
  }, []);

  return { chartRef };
};

export default useChart;
