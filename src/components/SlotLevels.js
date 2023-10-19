import React from "react";
import { Button, Grid, ButtonGroup } from "@mui/material";
import DiamondIcon from "@mui/icons-material/Diamond";

export function SlotLevels({ slotLevel, setSlotLevel }) {
  const slotLevels = [0, 1, 2, 3, 4];

  return (
    <>
      <Grid container alignItems="center">
        <Grid item xs={1.3}>
          <DiamondIcon color="primary" />
        </Grid>
        <Grid item>
          <ButtonGroup color="primary" variant="outlined" aria-label="radio button group">
            {slotLevels.map((level) => (
              <Button
                onClick={() => setSlotLevel(level)}
                sx={{
                  backgroundColor: slotLevel === level ? "#3f51b5" : "",
                  color: slotLevel === level ? "#fff" : "",
                }}
              >
                {level}
              </Button>
            ))}
          </ButtonGroup>
        </Grid>
      </Grid>
    </>
  );
}

export default SlotLevels;
