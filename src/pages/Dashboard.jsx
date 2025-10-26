"use client"; 
import Chart from "react-apexcharts";
import { Card, Grid } from "@mui/material";
import GraphOne from "../components/graph/graphOne";
import GraphTwo from "../components/graph/graphTwo";


export default function Dashboard() {
  const options = {
    chart: {
      id: "area-chart",
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  const series = [
    {
      name: "series1",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "series2",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ];

  return (
    <>
  
    <Grid container spacing={2}>
  <Grid size={{ xs: 6, md: 8 }}>

<Card>
          <GraphOne/>
</Card>
  </Grid>
  <Grid size={{ xs: 6, md: 4 }}>
    <Card>

            <GraphTwo/>
    </Card>
  </Grid>
  <Grid size={{ xs: 6, md: 4 }}>
    <Card>

  
         <GraphTwo/>
        
        
            </Card>
  </Grid>
  <Grid size={{ xs: 6, md: 8 }}>
    <Card>

                <GraphOne/>
            </Card>
  </Grid>
</Grid>
</>
  );
}
