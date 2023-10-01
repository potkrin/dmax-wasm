import React from "react";
import { Grid, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { StaticData } from "../data/StaticData";

export const DangoSetting = ({ userInputDataDango, updateUserInputData }) => {
  const handleChangeUserInputData = (key, event, value) => {
    value = event.target.value;
    updateUserInputData("食事", { ...userInputDataDango, [key]: value });
  };

  return (
    <>
      {Object.keys(StaticData["食事"]).map((key) => (
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{key}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              value={userInputDataDango[key]}
              label={key}
              onChange={(e) => handleChangeUserInputData(key, e)}
            >
              {Object.values(StaticData["食事"][key]).map((value) => (
                <MenuItem value={value}>{value}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ))}
    </>
  );
};

export default DangoSetting;
