import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Switch,
  Box,
  Slider,
  TextField,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  FormGroup,
} from "@mui/material";

import { StaticData } from "../data/StaticData";

export const MelodySetting = ({ userInputDataMelody, updateUserInputData }) => {
  const handleChangeUserInputData = (key, event, value) => {
    value = event.target.checked;
    updateUserInputData("旋律", { ...userInputDataMelody, [key]: value });
  };

  return (
    <>
      {StaticData["旋律"].map((item) => (
        <Grid item xs={1}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={userInputDataMelody[item]}
                  onChange={(e, v) => handleChangeUserInputData(item, e, v)}
                />
              }
              label={item}
            />
          </FormGroup>
        </Grid>
      ))}
    </>
  );
};

export default MelodySetting;
