import React, { useRef, useEffect } from "react";
import { Grid, Paper, Box, Card, Typography, CircularProgress, Divider } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ErrorIcon from "@mui/icons-material/Error";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";

import { theme } from "./ThemeProvider";

function NewlineText({ text }) {
  const newText = text
    .split("\n")
    .map((str, index, array) => (index === array.length - 1 ? str : `${str}<br/>`))
    .join("");

  return <span dangerouslySetInnerHTML={{ __html: newText }} />;
}

export const MiddleOutput = ({ middleOutput }) => {
  return (
    <>
      <Grid container alignItems={"center"} spacing={0} marginBottom={0.8}>
        <Grid item xs={0.5}>
          {middleOutput.status === "running" && (
            <CircularProgress size={10} sx={{ color: theme.palette.primary.main }} />
          )}
          {middleOutput.status === "complete" && (
            <CheckIcon color="success" sx={{ fontSize: 16 }} />
          )}
          {middleOutput.status === "error" && <ErrorIcon color="error" sx={{ fontSize: 16 }} />}
          {middleOutput.status === "waiting" && (
            <PanoramaFishEyeIcon sx={{ fontSize: 12, color: theme.palette.text.disabled }} />
          )}
        </Grid>
        <Grid item xs={11.5}>
          <Typography variant="body1" sx={{}}>
            {middleOutput.title}
          </Typography>
        </Grid>
        <Grid item xs={0.5}></Grid>
        <Grid item xs={3}>
          <Divider />
        </Grid>
        <Grid item xs={8.5}></Grid>

        {middleOutput.message !== "" ? (
          <>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={11.5}>
              <Typography
                variant="body1"
                sx={{ fontSize: "12px", color: theme.palette.text.secondary }}
              >
                <NewlineText text={middleOutput.message} />
              </Typography>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={11.5}>
              <Typography
                variant="body1"
                sx={{ fontSize: "12px", color: theme.palette.text.secondary, visibility: "hidden" }}
              >
                invisible
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default MiddleOutput;
