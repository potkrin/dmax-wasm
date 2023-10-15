import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import { SkillCard } from "./SkillCard";
import { staticSkillData } from "../data/StaticData";
import { SlotSelect } from "./SlotSelect";

import { armorDict } from "../data/EquipData";

/**
 * バグ: 選択済みのスキルをもう一度選択したとき追加できない
 * 再現方法: 「攻撃」を選択→「攻撃」を削除→「攻撃」を選択→追加できない
 */

// 列要素対応表
//        0,1,                 2,3,4,5,6
// 火事場力,3,              渾身,2,3,1,1
// 超会心  ,2,              体術,3,3,1,1
// 体術    ,3,通常弾・連射矢強化,2,3,1,1
export function QuriousArmorInput({ userQuriousArmorData, setUserQuriousArmorData }) {
  const [armorSuggestions, setArmorSuggestions] = useState(Object.keys(armorDict));
  const [skillSuggestions, setSkillSuggestions] = useState(Object.keys(staticSkillData));

  // Autoselect から追加されたスキル
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Autoselect のテキストボックスに入力されている値 (onFocus でリセットするために定義)
  const [currentSkill, setCurrentSkill] = useState(null);

  const handleSkillSelect = (event, newValue) => {
    setCurrentSkill(newValue);
    if (newValue === null) return;

    // スキルの種類は合計で5つまで (防具付属のスキル + 傀異錬成による追加スキル) <= 5
    if (selectedSkills.length + Object.keys(selectedArmor["skills"]).length >= 5) return;

    // すでに追加済みのスキルは追加しない
    if (selectedSkills.some((skill) => skill.name === newValue)) return;

    // 防具付属のスキルは追加しない
    if (newValue in selectedArmor["skills"]) return;

    setSelectedSkills((prev) => [...prev, { name: newValue, level: 1 }]);
  };

  const handleSkillRemove = (indexToRemove) => {
    setSelectedSkills((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const [selectedArmor, setSelectedArmor] = useState(null);

  const handleArmorSelect = (event, newValue) => {
    // 防具を選択したら現在のスキル入力用の項目をリセットする
    setSelectedSkills([]);

    if (newValue in armorDict) {
      setSelectedArmor(armorDict[newValue]);
      const tempSlots = armorDict[newValue]["slots"];
      while (tempSlots.length < 3) {
        tempSlots.push(0);
      }
      setSlots(tempSlots);
    }
  };

  const [slots, setSlots] = useState([0, 0, 0]);

  const handleSlotSelect = (index, newLevel) => {
    setSlots((prev) => {
      const newSlots = [...prev];
      newSlots[index] = parseInt(newLevel);
      return newSlots;
    });
  };

  // 登録ボタンを追加
  const registerQuriousArmor = () => {
    // 登録する新しい傀異錬成防具データ
    const tempQuriousArmor = JSON.parse(JSON.stringify(selectedArmor));

    // 傀異錬成元の防具
    const baseArmor = armorDict[selectedArmor["name"]];
    tempQuriousArmor["slots"] = [...slots.sort().reverse()];
    tempQuriousArmor["skills"] = { ...selectedArmor["skills"] };
    for (const skill of selectedSkills) tempQuriousArmor["skills"][skill.name] = skill.level;

    // 防具名はスキルとスロットの差分
    let name = selectedArmor["name"];
    name += " (";
    for (let skill in tempQuriousArmor["skills"]) {
      if (skill in baseArmor["skills"]) {
        let diffLevel = tempQuriousArmor["skills"][skill] - baseArmor["skills"][skill];
        if (diffLevel > 0) name += skill + "+" + diffLevel + ",";
        else if (diffLevel < 0) name += skill + diffLevel + ",";
      } else {
        name += skill + "+" + tempQuriousArmor["skills"][skill] + ",";
      }
    }

    const diffSlots =
      tempQuriousArmor["slots"].reduce((total, slot) => total + slot, 0) -
      baseArmor["slots"].reduce((total, slot) => total + slot, 0);

    if (diffSlots > 0) name += "スロット" + "+" + diffSlots;
    else if (diffSlots < 0) name += "スロット" + diffSlots;

    name += ")";
    tempQuriousArmor["name"] = name;

    setUserQuriousArmorData((prev) => [...prev, tempQuriousArmor]);
  };

  const handleInnateSkill = (skillName, skillLevel) => {
    setSelectedArmor((prev) => {
      const newArmor = JSON.parse(JSON.stringify(prev));
      newArmor.skills[skillName] = skillLevel;
      return newArmor;
    });
  };

  return (
    <>
      <Autocomplete
        options={armorSuggestions}
        onChange={handleArmorSelect}
        renderInput={(params) => <TextField {...params} label="防具" variant="outlined" />}
        sx={{ width: 480 }}
      />
      {selectedArmor &&
        Object.entries(selectedArmor["skills"]).map(([skill, level]) => (
          <SkillCard
            key={skill}
            skill={{ "name": skill, "level": level }}
            setSelectedSkills={setSelectedSkills}
            handleInnateSkill={handleInnateSkill}
            onRemove={() => handleSkillRemove(0)}
            allowRemove={false}
          />
        ))}

      {selectedArmor && (
        <Autocomplete
          options={skillSuggestions}
          onChange={handleSkillSelect}
          renderInput={(params) => <TextField {...params} label="スキル" variant="outlined" />}
          value={currentSkill}
          onFocus={() => {
            // 同じスキルを選択肢した場合に追加できない問題を回避するために, 選択肢をリセットする
            // [[Autocomplete] onChange not fired for same item consecutively #29159](https://github.com/mui/material-ui/issues/29159)
            setCurrentSkill("");
          }}
          sx={{ width: 480 }}
        />
      )}
      {selectedSkills.map((skill, index) => (
        <SkillCard
          key={index}
          skill={skill}
          setSelectedSkills={setSelectedSkills}
          onRemove={() => handleSkillRemove(index)}
          allowRemove={true}
        />
      ))}
      {selectedArmor && (
        <>
          <div>
            <SlotSelect
              value={slots[0]}
              onChange={(event) => handleSlotSelect(0, event.target.value)}
            />
          </div>
          <div>
            <SlotSelect
              value={slots[1]}
              onChange={(event) => handleSlotSelect(1, event.target.value)}
            />
          </div>
          <div>
            <SlotSelect
              value={slots[2]}
              onChange={(event) => handleSlotSelect(2, event.target.value)}
            />
          </div>
        </>
      )}

      <Button variant="contained" color="primary" onClick={registerQuriousArmor}>
        登録
      </Button>
    </>
  );
}

export default QuriousArmorInput;
