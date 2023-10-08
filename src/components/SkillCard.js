import React from "react";
import { Grid, Button, Typography } from "@mui/material";
import { staticSkillData } from "../data/StaticData";

export function SkillCard({ skill, setSelectedSkills, handleInnateSkill, onRemove, allowRemove }) {
  const updateSkillLevel = (level) => {
    if (allowRemove) {
      setSelectedSkills((prev) => {
        const newSkills = [...prev];
        newSkills[prev.indexOf(skill)] = { ...skill, level: level };
        return newSkills;
      });
    } else {
      handleInnateSkill(skill.name, level);
    }
  };

  return (
    <>
      {staticSkillData[skill.name] && (
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={4}>
            <Typography>
              {skill.name} Lv.{skill.level}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Button disabled={skill.level < 1} onClick={() => updateSkillLevel(skill.level - 1)}>
              -
            </Button>
            <Button
              disabled={staticSkillData[skill.name]["maxLevel"] <= skill.level}
              onClick={() => updateSkillLevel(skill.level + 1)}
            >
              +
            </Button>
          </Grid>
          {allowRemove && (
            <Grid item xs={4}>
              <Button onClick={onRemove}>Remove</Button>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}

export default SkillCard;
