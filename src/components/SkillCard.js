import React from "react";
import { Grid, Button, Typography, Divider } from "@mui/material";
import { staticSkillData } from "../data/StaticData";
import Add from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ClearIcon from "@mui/icons-material/Clear";

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
        <>
          <Grid container alignItems="center" spacing={2} sx={{ maxWidth: 480, padding: 2 }}>
            <Grid item xs={6}>
              <Typography sx={{ textAlign: "left" }}>
                {skill.name} Lv.{skill.level}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
                disabled={skill.level < 1}
                onClick={() => updateSkillLevel(skill.level - 1)}
                variant="outlined"
              >
                <RemoveIcon />
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                disabled={staticSkillData[skill.name]["maxLevel"] <= skill.level}
                onClick={() => updateSkillLevel(skill.level + 1)}
                variant="outlined"
              >
                <Add />
              </Button>
            </Grid>
            {allowRemove && (
              <Grid item xs={2}>
                <Button onClick={onRemove}>
                  <ClearIcon />
                </Button>
              </Grid>
            )}
          </Grid>
          <Divider sx={{ maxWidth: 480 }} />
        </>
      )}
    </>
  );
}

export default SkillCard;
