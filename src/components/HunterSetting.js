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

import { NumberTextField } from "./NumberTextField";
import { StaticData } from "../data/StaticData";

export const HunterSetting = ({ userInputDataHunter, updateUserInputData }) => {
  const handleChangeUserInputData = (key, event, value) => {
    if (key === "種ホムラ" || key === "疾替えの書" || key === "ヒトダマドリ") {
      value = event.target.value;
    } else {
      value = event.target.checked;
    }
    console.log(`key = ${key}, value = ${value}`);
    updateUserInputData("ハンター", { ...userInputDataHunter, [key]: value });
  };

  return (
    <>
      {Object.entries(StaticData["ハンター"])
        .filter(([_, value]) => typeof value === "boolean")
        .map(([key, _]) => (
          <Grid item xs={1}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userInputDataHunter[key]}
                    onChange={(e, v) => handleChangeUserInputData(key, e, v)}
                  />
                }
                label={key}
              />
            </FormGroup>
          </Grid>
        ))}
      {Object.entries(StaticData["ハンター"])
        .filter(([_, value]) => typeof value === "object")
        .map(([key, _]) => (
          <Grid item xs={1}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">{key}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size="small"
                value={userInputDataHunter[key]}
                label={key}
                onChange={(e) => handleChangeUserInputData(key, e)}
              >
                {Object.entries(StaticData["ハンター"][key]).map(([_, value]) => (
                  <MenuItem value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}

      {Object.entries(StaticData["ハンター"])
        .filter(([_, value]) => typeof value === "number")
        .map(([key, _]) => (
          <Grid item xs={1}>
            <NumberTextField
              value={userInputDataHunter[key]}
              size="small"
              id="outlined-basic"
              label={key}
              variant="outlined"
              onChange={(e, v) => handleChangeUserInputData(key, e, v)}
              min={key === "ヒトダマドリ" ? 0 : 0}
              max={key === "ヒトダマドリ" ? 20 : 20}
            />
          </Grid>
        ))}
    </>
  );
};

export default HunterSetting;
