import React from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  Typography,
} from "@mui/material";

export function SlotSelect({ value, onChange }) {
  return (
    <>
      <Grid item xs={3}>
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          スロット
        </Typography>
      </Grid>
      <Grid item xs={9}>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="slot"
            name="slot-select"
            value={value}
            onChange={onChange}
            sx={{ marginLeft: 2 }}
          >
            <FormControlLabel value={0} control={<Radio />} label="0" />
            <FormControlLabel value={1} control={<Radio />} label="1" />
            <FormControlLabel value={2} control={<Radio />} label="2" />
            <FormControlLabel value={3} control={<Radio />} label="3" />
            <FormControlLabel value={4} control={<Radio />} label="4" />
          </RadioGroup>
        </FormControl>
      </Grid>
    </>
  );
}

export default SlotSelect;
