"use client";

import React from "react";
import Chart from "react-apexcharts";
import { Typography, Box } from "@mui/material";

export default function GraphTwo() {
  const options = {
    chart: {
      type: "donut",
    },
    labels: ["Satışlar", "Kazançlar", "Zararlar", "Harcamalar"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
    },
    colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560"], // güzel renkler
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = [44, 55, 13, 43]; // her biri bir dilimi temsil ediyor

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" mb={2}>
        İşletme Performansı
      </Typography>

      <Chart
        options={options}
        series={series}
        type="donut"
        width="380"
        height={270}
      />
    </Box>
  );
}
