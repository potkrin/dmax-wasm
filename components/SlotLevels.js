import React from "react";
import { Button, Grid, ButtonGroup } from "@mui/material";
import DiamondIcon from "@mui/icons-material/Diamond";
import { LDThemeContext } from "./LDThemeContext";

export function SlotLevels({ slotLevel, setSlotLevel }) {
  const slotLevels = [0, 1, 2, 3, 4];

  const { currentTheme } = React.useContext(LDThemeContext);

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
                key={level}
                onClick={() => setSlotLevel(level)}
                sx={{
                  backgroundColor: slotLevel === level ? currentTheme.palette.primary.main : "",
                  color: slotLevel === level ? currentTheme.palette.primary.contrastText : "",
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
