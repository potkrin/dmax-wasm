import React from "react";
import { Grid, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";

import { staticData } from "../data/StaticData";
import { useStyles, GridItemInput } from "./DmaxMain";

export const MelodySetting = ({ userInputDataMelody, updateUserInputData }) => {
  const classes = useStyles();

  const handleChangeUserInputData = (key, event, value) => {
    value = event.target.checked;

    // 攻撃旋律と気炎の旋律は同時に入力できないようにする
    let toggleKey;
    if (key === "攻撃旋律" && value === true && userInputDataMelody["気炎の旋律"] === true)
      toggleKey = "気炎の旋律";

    if (key === "気炎の旋律" && value === true && userInputDataMelody["攻撃旋律"] === true)
      toggleKey = "攻撃旋律";

    updateUserInputData("旋律", { ...userInputDataMelody, [key]: value, [toggleKey]: false });
  };

  return (
    <>
      {staticData["旋律"].map((item) => (
        <GridItemInput item>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={userInputDataMelody[item]}
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

export default MelodySetting;
