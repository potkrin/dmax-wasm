import React from "react";
import { Grid, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";

import { staticData } from "../data/StaticData";
import { useStyles, GridItemInput } from "./DmaxMain";

export const RampageDecoSetting = ({ userInputDataRampageDeco, updateUserInputData }) => {
  const classes = useStyles();

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
        <GridItemInput item>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={userInputDataRampageDeco[item]}
                  onChange={(e, v) => handleChangeUserInputData(item, e, v)}
                  size="small"
                />
              }
              label={<Typography className={classes.inputCheckbox}>{item}</Typography>}
            />
          </FormGroup>
        </GridItemInput>
      ))}
    </>
  );
};

export default RampageDecoSetting;
