import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

export const DmaxGraph = ({ chartData }) => {
  const [chartWidth, setChartWidth] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      setChartWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Grid item xs={6} ref={containerRef}>
      <LineChart
        width={chartWidth}
        height={450}
        data={chartData}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="time" unit="s" type="number" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#f5f5f5" />
        <Line
          type="linear"
          dataKey="upperLimit"
          stroke="#ff7300"
          yAxisId="left"
          animationDuration={300}
        />
        <Line
          type="linear"
          dataKey="lowerLimit"
          stroke="#387908"
          yAxisId="left"
          animationDuration={300}
        />
        <Line
          type="linear"
          dataKey="usedMemory"
          stroke="#4169e1"
          strokeDasharray={"3 3"}
          dot={false}
          yAxisId="right"
          animationDuration={300}
        />
      </LineChart>
    </Grid>
  );
};

export default DmaxGraph;
