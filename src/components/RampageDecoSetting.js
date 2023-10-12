import React from "react";
import { Grid, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";

import { staticData } from "../data/StaticData";

export const RampageDecoSetting = ({ userInputDataRampageDeco, updateUserInputData }) => {
  const handleChangeUserInputData = (key, event, value) => {
    value = event.target.checked;

    // 劫血活性Lv1 と Lv2 は同時に入力できないようにする
    let toggleKey;
    if (key === "劫血活性Lv1" && value === true && userInputDataRampageDeco["劫血活性Lv2"] === true)
      toggleKey = "劫血活性Lv2";

    if (key === "劫血活性Lv2" && value === true && userInputDataRampageDeco["劫血活性Lv1"] === true)
      toggleKey = "劫血活性Lv1";

    updateUserInputData("百竜装飾品", {
      ...userInputDataRampageDeco,
      [key]: value,
      [toggleKey]: false,
    });
  };

  return (
    <>
      {staticData["百竜装飾品"].map((item) => (
        <Grid item xs={1.5}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={userInputDataRampageDeco[item]}
                  onChange={(e, v) => handleChangeUserInputData(item, e, v)}
                  size="small"
                />
              }
              label={<Typography style={{ "fontSize": "12px" }}>{item}</Typography>}
            />
          </FormGroup>
        </Grid>
      ))}
    </>
  );
};

export default RampageDecoSetting;
