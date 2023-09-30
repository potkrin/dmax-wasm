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

export const WeaponSetting = ({ userInputDataWeapon, updateUserInputData }) => {
  const handleChangeUserInputData = (key, event, value) => {
    // if (key === "物理肉質" || key === "属性肉質") {
    //   // TextField から呼び出された場合
    //   value = event.target.value === "" ? 0 : Number(event.target.value);
    // }
    // if (key === "怒り補正") {
    //   value = event.target.value;
    // }
    // if (key === "水やられ") {
    //   // CheckBox から呼び出された場合
    //   value = event.target.checked;
    // }
    value = event.target.value;
    updateUserInputData("武器", { ...userInputDataWeapon, [key]: value });
  };

  const textFieldKeys = ["攻撃力", "会心率", "属性値"];

  return (
    <>
      {textFieldKeys.map((key) => (
        <Grid item xs={1.5}>
          <NumberTextField
            value={userInputDataWeapon[key]}
            size="small"
            id="outlined-basic"
            label={key}
            variant="outlined"
            onChange={(e, v) => handleChangeUserInputData(key, e, v)}
            min={0}
            max={key === "会心率" ? 100 : 1000}
          />
        </Grid>
      ))}

      {Object.keys(StaticData["武器"]).map((key) => (
        <Grid item xs={1.5}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{key}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              value={userInputDataWeapon[key]}
              label={key}
              onChange={(e, v) => handleChangeUserInputData(key, e, v)}
            >
              {Object.keys(StaticData["武器"][key]).map((key) => (
                <MenuItem value={key}>{key}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ))}
    </>
  );
};

export default WeaponSetting;
