import React, { useState, useEffect, useRef } from "react";
import { Grid, Card } from "@mui/material";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { theme } from "./ThemeProvider";
import { LDThemeContext } from "./LDThemeContext";

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

  const { currentTheme, toggleTheme } = React.useContext(LDThemeContext);

  return (
    <Grid item xs={12} md={6} ref={containerRef}>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 1,
          padding: "8px",
          height: "610px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        height={610}
        backgroundColor="#ffffff"
      >
        <LineChart width={chartWidth} height={450} data={chartData} margin="auto" display="block">
          <XAxis
            dataKey="time"
            unit="s"
            type="number"
            tick={{ fill: currentTheme.palette.text.secondary }}
          />
          <YAxis yAxisId="left" tick={{ fill: currentTheme.palette.text.secondary }} />
          <YAxis
            yAxisId="right"
            unit="MB"
            type="number"
            orientation="right"
            tick={{ fontSize: 10, fill: currentTheme.palette.text.secondary }}
          />
          <Tooltip
            formatter={(value, name) => {
              let unit;
              switch (name) {
                case "メモリ使用量":
                  unit = " MB";
                  break;
                default:
                  unit = ""; // 何もしない
              }
              return [`${value}${unit}`, name];
            }}
            contentStyle={{ backgroundColor: currentTheme.palette.background.default }}
          />
          <Legend />
          <CartesianGrid stroke="#f5f5f5" />
          <Line
            type="linear"
            dataKey="upperLimit"
            name="ダメージ上限"
            stroke={currentTheme.palette.primary.main}
            yAxisId="left"
            animationDuration={300}
          />
          <Line
            type="linear"
            dataKey="lowerLimit"
            name="ダメージ下限"
            stroke={currentTheme.palette.secondary.main}
            yAxisId="left"
            animationDuration={300}
          />
          <Line
            type="linear"
            dataKey="usedMemory"
            name="メモリ使用量"
            stroke={currentTheme.palette.text.secondary}
            strokeDasharray={"3 3"}
            dot={false}
            yAxisId="right"
            animationDuration={300}
          />
        </LineChart>
      </Card>
    </Grid>
  );
};

export default DmaxGraph;
