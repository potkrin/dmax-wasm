import React from "react";
import { Grid, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { NumberTextField } from "./NumberTextField";
import { staticData } from "../data/StaticData";

import { useStyles, GridItemInput } from "./DmaxMain";

const numberFieldKeys = ["攻撃力", "会心率", "属性値"];

export const WeaponSetting = ({ userInputDataWeapon, updateUserInputData }) => {
  const classes = useStyles();
  const handleChangeUserInputData = (key, event, value) => {
    if (key in numberFieldKeys) {
      value = parseInt(event.target.value);
    } else {
      value = event.target.value;
    }
    updateUserInputData("武器", { ...userInputDataWeapon, [key]: value });
  };

  return (
    <>
      {numberFieldKeys.map((key) => (
        <GridItemInput item>
          <NumberTextField
            value={userInputDataWeapon[key]}
            size="small"
            id="outlined-basic"
            label={key}
            variant="outlined"
            onChange={(e, v) => handleChangeUserInputData(key, e, v)}
            min={0}
            max={key === "会心率" ? 100 : 1000}
            fullWidth
          />
        </GridItemInput>
      ))}

      {Object.keys(staticData["武器"]).map((key) => (
        <GridItemInput item>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{key}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              value={userInputDataWeapon[key]}
              label={key}
              onChange={(e, v) => handleChangeUserInputData(key, e, v)}
              style={{ textAlign: "left" }}
            >
              {Object.keys(staticData["武器"][key]).map((key) => (
                <MenuItem value={key}>{key}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </GridItemInput>
      ))}
    </>
  );
};

export default WeaponSetting;
