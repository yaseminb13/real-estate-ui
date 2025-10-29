import Chart from "react-apexcharts";
import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../../features/properties/propertySlice";

export default function GraphOne() {
  const dispatch = useDispatch();
  const { items: properties, loading } = useSelector((state) => state.properties);

  const [chartData, setChartData] = useState({
    series: [
      {
        name: "İlan Sayısı",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: "50%",
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Şehirler",
        },
      },
      yaxis: {
        title: {
          text: "İlan Sayısı",
        },
      },
      title: {
        text: "Şehirlere Göre Emlak Dağılımı",
        align: "center",
      },
      colors: ["#00E396"],
    },
  });

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  useEffect(() => {
    if (properties && properties.length > 0) {
      const cityCounts = properties.reduce((acc, property) => {
        const city = property.city || "Bilinmiyor";
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {});

      const cities = Object.keys(cityCounts);
      const counts = Object.values(cityCounts);

      setChartData((prev) => ({
        ...prev,
        series: [{ name: "İlan Sayısı", data: counts }],
        options: {
          ...prev.options,
          xaxis: { ...prev.options.xaxis, categories: cities },
        },
      }));
    }
  }, [properties]);

  return (
    <Card sx={{ p: 2 }}>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={320}
      />
    </Card>
  );
}
