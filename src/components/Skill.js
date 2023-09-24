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
  Select,
  MenuItem,
} from "@mui/material";

import { StaticData } from "../data/StaticData";

const Skill = ({ skillInfo, userInputData, updateUserInputData }) => {
  const handleChangeSkillInfo = (key, event, value) => {
    if (key === "activeRate" && !value) {
      // TextField から呼び出された場合
      value = event.target.value === "" ? 0 : Number(event.target.value);
    }
    if (key === "fixLevel") {
      // CheckBox から呼び出された場合
      value = event.target.checked;
    }
    // updateSkillInfo(skillInfo.name, { ...skillInfo, [key]: value });
    // updateUserInputDataSkill(skillInfo.name, key, value);
    updateUserInputData("スキル", {
      ...userInputData["スキル"],
      [skillInfo.name]: {
        ...userInputData["スキル"][skillInfo.name],
        [key]: value,
      },
    });
  };

  const handleChangeOther = (key, event, value) => {
    if ((key === "全属性耐性値" || key === "狂竜症") && !value) {
      // TextField から呼び出された場合
      value = event.target.value === "" ? 0 : Number(event.target.value);
    } else {
      value = event.target.value;
    }

    // updateSkillInfo(skillInfo.name, { ...skillInfo, [key]: value });
    // updateUserInputDataSkill(skillInfo.name, key, value);
    updateUserInputData("その他", { ...userInputData["その他"], [key]: value });
  };

  const skillInput = userInputData["スキル"][skillInfo.name];

  return (
    <>
      <Grid item xs={2}>
        <Typography variant="body2">{skillInfo.name}</Typography>
      </Grid>
      {skillInfo.type === "Damage" ? (
        <>
          <Grid item xs={1}>
            <Box sx={{ width: 50 }}>
              <Slider
                value={skillInput.activeRate}
                size="small"
                aria-label="Temperature"
                valueLabelDisplay="auto"
                min={0}
                max={100}
                onChange={(e, v) => handleChangeSkillInfo("activeRate", e, v)}
              />
            </Box>
          </Grid>
          <Grid item xs={1}>
            <TextField
              value={skillInput.activeRate}
              size="small"
              id="outlined-basic"
              label="%"
              variant="outlined"
              onChange={(e, v) => handleChangeSkillInfo("activeRate", e, v)}
            />
          </Grid>
        </>
      ) : (
        <Grid item xs={2}></Grid>
      )}
      <Grid item xs={1}>
        <Checkbox
          checked={skillInput.fixLevel}
          onChange={(e, v) => handleChangeSkillInfo("fixLevel", e, v)}
        />
      </Grid>
      <Grid item xs={4}>
        <Box sx={{ width: 50 * skillInfo.maxLevel }}>
          <Slider
            aria-label="Temperature"
            value={skillInput.minLevel}
            valueLabelDisplay="auto"
            step={1}
            marks={Array.from({ length: skillInfo.maxLevel + 1 }, (_, level) => ({
              value: level,
              label: String(level),
            }))}
            min={0}
            max={skillInfo.maxLevel}
            onChange={(e, v) => handleChangeSkillInfo("minLevel", e, v)}
          />
        </Box>
      </Grid>
      {/* 下記の方法で条件分岐によるコンポーネント追加ができる 
          データの管理方法はこのあと考える 
      */}
      {skillInfo.name === "龍気変換" ? (
        <Grid item xs={1}>
          <TextField
            label="全属性耐性合計"
            size="small"
            value={userInputData["その他"]["全属性耐性値"]}
            onChange={(e, v) => handleChangeOther("全属性耐性値", e, v)}
          />
        </Grid>
      ) : skillInfo.name === "狂竜症【蝕】" ? (
        <Grid item xs={1}>
          <TextField
            label="狂竜症感染時割合"
            size="small"
            value={userInputData["その他"]["狂竜症【蝕】感染時割合"]}
            onChange={(e, v) => handleChangeOther("狂竜症【蝕】感染時割合", e, v)}
          />
        </Grid>
      ) : skillInfo.name === "伏魔響命" ? (
        <Grid item xs={1}>
          <FormControl style={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-label">キュリア</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              value={userInputData["その他"]["キュリア"]}
              label={"キュリア"}
              onChange={(e) => handleChangeOther("キュリア", e)}
            >
              {Object.entries(StaticData["その他"]["キュリア"]).map(([_, value]) => (
                <MenuItem value={value}>{value}匹</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ) : skillInfo.name === "血氣覚醒" ? (
        <Grid item xs={1}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">血氣覚醒</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              value={userInputData["その他"]["血氣覚醒"]}
              label={"血氣覚醒"}
              onChange={(e) => handleChangeOther("血氣覚醒", e)}
            >
              {Object.entries(StaticData["その他"]["血氣覚醒"]).map(([_, value]) => (
                <MenuItem value={value}>{value}段階目</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ) : (
        <Grid item xs={1}></Grid>
      )}
      <Grid item xs={2}></Grid>
    </>
  );
};

export default Skill;
