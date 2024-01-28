import React, { useRef, useEffect } from "react";
import { Grid, Paper, Box, Card, Typography, CircularProgress, Divider } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ErrorIcon from "@mui/icons-material/Error";
import CancelIcon from "@mui/icons-material/Cancel";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import { useTheme } from "@mui/material/styles";

function NewlineText({ text }) {
  const newText = text
    .split("\n")
    .map((str, index, array) => (index === array.length - 1 ? str : `${str}<br/>`))
    .join("");

  return <span dangerouslySetInnerHTML={{ __html: newText }} />;
}

export const MiddleOutput = ({ middleOutput }) => {
  const currentTheme = useTheme();

  return (
    <>
      <Grid container alignItems={"center"} spacing={0} marginBottom={0.8}>
        <Grid item xs={0.5}>
          {middleOutput.status === "running" && (
            <CircularProgress size={10} sx={{ color: currentTheme.palette.primary.main }} />
          )}
          {middleOutput.status === "complete" && (
            <CheckIcon color="success" sx={{ fontSize: 16 }} />
          )}
          {middleOutput.status === "error" && <ErrorIcon color="error" sx={{ fontSize: 16 }} />}
          {middleOutput.status === "interrupted" && (
            <CancelIcon color="error" sx={{ fontSize: 16 }} />
          )}

          {middleOutput.status === "waiting" && (
            <PanoramaFishEyeIcon sx={{ fontSize: 12, color: currentTheme.palette.text.disabled }} />
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
                sx={{
                  fontSize: "12px",
                  color:
                    (middleOutput.status === "error") | (middleOutput.status === "interrupted")
                      ? currentTheme.palette.error.main
                      : currentTheme.palette.text.secondary,
                }}
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
                sx={{
                  fontSize: "12px",
                  color: currentTheme.palette.text.secondary,
                  visibility: "hidden",
                }}
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
