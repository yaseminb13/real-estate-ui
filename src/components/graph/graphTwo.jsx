import Chart from "react-apexcharts";
import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../../features/properties/propertySlice";

export default function GraphTwo() {
  const dispatch = useDispatch();
  const { items: properties, loading } = useSelector((state) => state.properties);

  const [chartData, setChartData] = useState({
    series: [0, 0],
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Satılık", "Kiralık"],
      legend: {
        position: "bottom",
      },
      colors: ["#008FFB", "#FEB019"],
      dataLabels: {
        enabled: true,
      },
      title: {
        text: "Emlak Türü Dağılımı",
        align: "center",
      },
    },
  });

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  useEffect(() => {
    if (properties && properties.length > 0) {
      const satilikCount = properties.filter((p) => p.type === "Satılık").length;
      const kiralikCount = properties.filter((p) => p.type === "Kiralık").length;

      setChartData((prev) => ({
        ...prev,
        series: [satilikCount, kiralikCount],
      }));
    }
  }, [properties]);

  return (
    <Card sx={{ p: 2 }}>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="donut"
        height={335}
      />
    </Card>
  );
}