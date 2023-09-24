import React, { useRef, useEffect } from "react";
import { Grid, Paper, Box } from "@mui/material";

export const DmaxOutput = ({ dmaxOutput }) => {
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [dmaxOutput]);

  return (
    <Grid item xs={6}>
      <Paper elevation={2}>
        <Box
          ref={boxRef}
          style={{
            height: "450px",
            overflowY: "auto",
            padding: "8px",
            textAlign: "left",
          }}
        >
          <pre>{dmaxOutput}</pre>
        </Box>
      </Paper>
    </Grid>
  );
};

export default DmaxOutput;
