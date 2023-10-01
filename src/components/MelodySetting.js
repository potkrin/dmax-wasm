import React from "react";
import { Grid, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

import { staticData } from "../data/StaticData";

export const MelodySetting = ({ userInputDataMelody, updateUserInputData }) => {
  const handleChangeUserInputData = (key, event, value) => {
    value = event.target.checked;
    updateUserInputData("旋律", { ...userInputDataMelody, [key]: value });
  };

  return (
    <>
      {staticData["旋律"].map((item) => (
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
