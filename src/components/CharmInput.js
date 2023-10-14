import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Box, Card, Typography, Divider } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import AddIcon from "@mui/icons-material/Add";

import { SkillCard } from "./SkillCard";
import { staticSkillData } from "../data/StaticData";
import { SlotSelect } from "./SlotSelect";

// import { makeStyles } from "@mui/styles";
import { useStyles } from "./DmaxMain";

/**
 * バグ: 選択済みのスキルをもう一度選択したとき追加できない
 * 再現方法: 「攻撃」を選択→「攻撃」を削除→「攻撃」を選択→追加できない
 */

// 列要素対応表
//        0,1,                 2,3,4,5,6
// 火事場力,3,              渾身,2,3,1,1
// 超会心  ,2,              体術,3,3,1,1
// 体術    ,3,通常弾・連射矢強化,2,3,1,1
export function CharmInput({ userCharmData, setUserCharmData }) {
  const classes = useStyles();
  const [suggestions, setSuggestions] = useState(Object.keys(staticSkillData));

  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSkillSelect = (event, newValue) => {
    if (selectedSkills.length < 2 && newValue !== null) {
      setSelectedSkills((prev) => [...prev, { name: newValue, level: 1 }]);
    }
  };

  const handleSkillRemove = (indexToRemove) => {
    setSelectedSkills((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const [slots, setSlots] = useState([0, 0, 0]);
  useEffect(() => {
    console.log(slots);
  }, [slots]);

  const handleSlotSelect = (index, newLevel) => {
    setSlots((prev) => {
      const newSlots = [...prev];
      newSlots[index] = parseInt(newLevel);
      return newSlots;
    });
  };

  // 登録ボタンを追加
  const registerCharm = () => {
    const tempCharm = {
      "rare": 0,
      "type": "charm",
      "deffence": 0,
      "fire": "0",
      "water": "0",
      "ice": "0",
      "thunder": "0",
      "dragon": "0",
      "skills": {},
      "slots": [...slots.sort().reverse()],
      // 護石【攻撃2, 連撃2】4-1-1 形式で名前を作成
    };
    for (const skill of selectedSkills) {
      tempCharm.skills[skill.name] = skill.level;
    }
    let name = "護石【";
    for (const [index, skill] of selectedSkills.entries()) {
      if (index !== 0) name += ", ";
      name += skill.name + skill.level;
    }
    name += "】" + slots.join("-");
    tempCharm.name = name;
    console.log(tempCharm);
    setUserCharmData((prev) => [...prev, tempCharm]);
  };

  return (
    <>
      <Box sx={{ backgroundColor: "#f3f6f9" }}>
        <Card
          variant="outlined"
          sx={{ borderRadius: 4, padding: "20px", maxWidth: 480 }}
          backgroundColor="#f5f5f5"
        >
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            className={classes.customHeaderNoMargin}
            marginBottom={2}
          >
            護石入力
          </Typography>

          <Autocomplete
            options={suggestions}
            onChange={handleSkillSelect}
            renderInput={(params) => <TextField {...params} label="Search" variant="outlined" />}
            sx={{ maxWidth: 480 }}
          />
          {selectedSkills.map((skill, index) => (
            <SkillCard
              key={index}
              skill={skill}
              setSelectedSkills={setSelectedSkills}
              onRemove={() => handleSkillRemove(index)}
              allowRemove={true}
            />
          ))}
          <Grid container sx={{ width: 520, marginTop: 2 }}>
            <SlotSelect
              value={slots[0]}
              onChange={(event) => handleSlotSelect(0, event.target.value)}
            />
            <SlotSelect
              value={slots[1]}
              onChange={(event) => handleSlotSelect(1, event.target.value)}
            />
            <SlotSelect
              value={slots[2]}
              onChange={(event) => handleSlotSelect(2, event.target.value)}
            />
          </Grid>

          <Box sx={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={registerCharm}
              endIcon={<AddIcon />}
            >
              登録
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
}

export default CharmInput;
