import React from "react";
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";

export function SlotSelect({ value, onChange }) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Slot Select</FormLabel>
      <RadioGroup row aria-label="slot" name="slot-select" value={value} onChange={onChange}>
        <FormControlLabel value={0} control={<Radio />} label="0" />
        <FormControlLabel value={1} control={<Radio />} label="1" />
        <FormControlLabel value={2} control={<Radio />} label="2" />
        <FormControlLabel value={3} control={<Radio />} label="3" />
        <FormControlLabel value={4} control={<Radio />} label="4" />
      </RadioGroup>
    </FormControl>
  );
}

export default SlotSelect;
