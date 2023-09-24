import React from "react";
import { Typography, Grid, Box, Slider, TextField, Checkbox } from "@mui/material";

export const Skill = ({
  skillInfo,
  updateSkillInfo,
  userInputDataSkill,
  updateUserInputDataSkill,
}) => {
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
    updateUserInputData("スキル", { ...userInputDataSkill, [key]: value });
    updateUserInputDataSkill(skillInfo.name, key, value);
  };

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
                value={skillInfo.activeRate}
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
              value={skillInfo.activeRate}
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
          checked={skillInfo.fixLevel}
          onChange={(e, v) => handleChangeSkillInfo("fixLevel", e, v)}
        />
      </Grid>
      <Grid item xs={7}>
        <Box sx={{ width: 50 * skillInfo.maxLevel }}>
          <Slider
            aria-label="Temperature"
            value={skillInfo.minLevel}
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
            {skillInfo.name === "龍気変換" && (
              <TextField
                label="全属性耐性合計"
                value={skillInfo.value || ""}
                onChange={(e) => handleChangeSkillInfo("value", e)}
              />
      
            )}
            */}
    </>
  );
};
