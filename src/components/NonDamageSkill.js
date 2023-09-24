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
} from "@mui/material";

const NonDamageSkill = ({ skillInfo, updateSkillInfo }) => {
  const handleChangeNonDamageSkillInfo = (key, event, value) => {
    updateSkillInfo(skillInfo.name, { ...skillInfo, [key]: event.target.value });
  };

  return (
    <>
      <Grid item xs={2}>
        <Box margin={1}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{skillInfo.name}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={skillInfo.minLevel}
              label={skillInfo.name}
              onChange={(e, v) => handleChangeNonDamageSkillInfo("minLevel", e, v)}
            >
              {Array.from({ length: skillInfo.maxLevel + 1 }, (_, i) => (
                <MenuItem value={i}>Lv{i}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
    </>
  );
};

export default NonDamageSkill;
