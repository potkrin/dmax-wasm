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

export const RampageDecoSetting = ({ userInputDataRampageDeco, updateUserInputData }) => {
  const handleChangeUserInputData = (key, event, value) => {
    value = event.target.checked;
    updateUserInputData("百竜装飾品", { ...userInputDataRampageDeco, [key]: value });
  };

  return (
    <>
      {StaticData["百竜装飾品"].map((item) => (
        <Grid item xs={1}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={userInputDataRampageDeco[item]}
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

export default RampageDecoSetting;
