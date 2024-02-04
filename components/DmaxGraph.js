import React, { useState, useEffect, useRef } from "react";
import { Grid, Card, useMediaQuery } from "@mui/material";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useTheme } from "@mui/material/styles";
import { theme, breakpoints } from "../src/theme";

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

  const currentTheme = useTheme();

  // // const { mode, setMode } = useColorScheme();
  // const [mounted, setMounted] = React.useState(false);

  // React.useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) {
  //   // for server-side rendering
  //   // learn more at https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
  //   return null;
  // }

  const matches = useMediaQuery("(max-width: " + breakpoints.values.sm + "px)"); // 'sm' は600pxに設定されていることが多い

  return (
    <Grid item xs={12} md={6} ref={containerRef}>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 1,
          padding: "16px 8px",
          minHeight: "450px",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        height={610}
      >
        <LineChart
          width={chartWidth}
          height={matches ? chartWidth - 40 : 500}
          data={chartData}
          margin="auto"
          display="block"
        >
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
          <Legend wrapperStyle={{ fontSize: "0.9rem" }} />
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
