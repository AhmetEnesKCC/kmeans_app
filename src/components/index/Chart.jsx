import ApexChart from "react-apexcharts";

const Chart = ({ title, chartOptions }) => {
  return (
    <div className="graph-wrapper">
      <div className="graph-title">{title}</div>
      <ApexChart
        type="bar"
        options={{
          ...chartOptions?.options,
          ...{
            theme: {
              mode: "dark",
            },
          },
        }}
        series={chartOptions?.series}
        className="graph"
      />
    </div>
  );
};

export default Chart;
