import { useEffect } from "react";
import useChart from "../../hooks/useChart";

const Chart = ({ title, chartOptions }) => {
  const { chartRef } = useChart(chartOptions);

  return (
    <div className="graph-wrapper">
      <div className="graph-title">{title}</div>
      <div className="graph" ref={chartRef}></div>
    </div>
  );
};

export default Chart;
