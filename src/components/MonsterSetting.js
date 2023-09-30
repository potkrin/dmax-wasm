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
import { NumberTextField } from "./NumberTextField";

export const MonsterSetting = ({ userInputDataMonster, updateUserInputData }) => {
  const handleChangeUserInputData = (key, event, value) => {
    if (key === "物理肉質" || key === "属性肉質" || key === "怒り補正") {
      value = parseInt(event.target.value);
    }
    if (key === "水やられ") {
      // CheckBox から呼び出された場合
      value = event.target.checked;
    }

    console.log("MonsterSetting: handleChangeUserInputData: key, value", key, value);

    updateUserInputData("モンスター", { ...userInputDataMonster, [key]: value });
  };

  return (
    <>
      <Grid item xs={1}>
        <NumberTextField
          value={userInputDataMonster["物理肉質"]}
          size="small"
          id="outlined-basic"
          label="物理肉質"
          variant="outlined"
          onChange={(e, v) => handleChangeUserInputData("物理肉質", e, v)}
          min={0}
          max={100}
        />
      </Grid>
      <Grid item xs={1}>
        <NumberTextField
          value={userInputDataMonster["属性肉質"]}
          size="small"
          id="outlined-basic"
          label="属性肉質"
          variant="outlined"
          onChange={(e, v) => handleChangeUserInputData("属性肉質", e, v)}
          min={0}
          max={100}
        />
      </Grid>
      <Grid item xs={2}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">怒り補正</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            size="small"
            value={userInputDataMonster["怒り補正"]}
            label="怒り補正"
            onChange={(e, v) => handleChangeUserInputData("怒り補正", e, v)}
          >
            {Object.entries(StaticData["怒り補正"]).map(([key, value]) => (
              <MenuItem value={value}>
                {key}: {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={2}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={userInputDataMonster["水やられ"]}
                onChange={(e, v) => handleChangeUserInputData("水やられ", e, v)}
              />
            }
            label="水やられ"
          />
        </FormGroup>
      </Grid>
    </>
  );
};

export default MonsterSetting;
