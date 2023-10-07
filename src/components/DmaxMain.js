import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";

import { Skill } from "./Skill";
import { NonDamageSkill } from "./NonDamageSkill";
import { MonsterSetting } from "./MonsterSetting";
import { WeaponSetting } from "./WeaponSetting";
import { HunterSetting } from "./HunterSetting";
import { DangoSetting } from "./DangoSetting";
import { MelodySetting } from "./MelodySetting";
import { RampageDecoSetting } from "./RampageDecoSetting";
import { DmaxSolver } from "./DmaxSolver";
import { ValidateData } from "./ValidateData";

import { staticSkillData } from "../data/StaticData";
import { userInputData as defaultUserInputData } from "../data/UserInputData";

/**
 * TODO:
 *   - スキルの検索ボックス。文字列がヒットしたもののみ残る
 *   - state 更新の軽量化
 */

export function DmaxMain() {
  // スキル以外のユーザ入力データを保持
  const cacheUserInputData = localStorage.getItem("userInputData");

  // localstorage に過去のユーザ入力が保存されていればそれを読み込む (なければ静的ファイルからを読み込む)
  let initUserInputData;
  if (cacheUserInputData !== null) {
    initUserInputData = JSON.parse(cacheUserInputData);
  } else {
    initUserInputData = defaultUserInputData;
  }

  const [userInputData, setUserInputData] = useState(initUserInputData);

  const updateUserInputData = (key, value) => {
    setUserInputData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // ユーザが入力するたびに入力データを localstorage に書き込み
  useEffect(() => {
    localStorage.setItem("userInputData", JSON.stringify(userInputData));
  }, [userInputData]);

  return (
    <div className="DmaxMain">
      {/* 読み込みデータの検証 */}
      <ValidateData />

      <Grid container spacing={1} marginY={1}>
        <MonsterSetting
          userInputDataMonster={userInputData["モンスター"]}
          updateUserInputData={updateUserInputData}
        />
      </Grid>
      <Grid container spacing={1} marginY={1}>
        <WeaponSetting
          userInputDataWeapon={userInputData["武器"]}
          updateUserInputData={updateUserInputData}
        />
      </Grid>
      <Grid container spacing={1} marginY={1}>
        <HunterSetting
          userInputDataHunter={userInputData["ハンター"]}
          updateUserInputData={updateUserInputData}
        />
      </Grid>
      <Grid container spacing={1} marginY={1}>
        <DangoSetting
          userInputDataDango={userInputData["食事"]}
          updateUserInputData={updateUserInputData}
        />
      </Grid>
      <Grid container spacing={1} marginY={1}>
        <MelodySetting
          userInputDataMelody={userInputData["旋律"]}
          updateUserInputData={updateUserInputData}
        />
      </Grid>
      <Grid container spacing={1} marginY={1}>
        <RampageDecoSetting
          userInputDataRampageDeco={userInputData["百竜装飾品"]}
          updateUserInputData={updateUserInputData}
        />
      </Grid>

      {/* スライダーありのスキル */}
      <Grid container marginTop={8}>
        {Object.keys(staticSkillData)
          .filter((key) => staticSkillData[key].type === "FixedLevelDamage")
          .map((key) => (
            <Skill
              staticSkillData={staticSkillData[key]}
              userInputData={userInputData}
              updateUserInputData={updateUserInputData}
            />
          ))}
        {Object.keys(staticSkillData)
          .filter((key) => staticSkillData[key].type === "Damage")
          .map((key) => (
            <Skill
              staticSkillData={staticSkillData[key]}
              userInputData={userInputData}
              updateUserInputData={updateUserInputData}
            />
          ))}
        {Object.keys(staticSkillData)
          .filter((key) => staticSkillData[key].type === "FreqNonDamage")
          .map((key) => (
            <Skill
              staticSkillData={staticSkillData[key]}
              userInputData={userInputData}
              updateUserInputData={updateUserInputData}
            />
          ))}
      </Grid>

      {/* スライダーなしのスキル 最大Lv5以上, Lv4, Lv3, ... */}
      <Grid container marginTop={2}>
        {Object.keys(staticSkillData)
          .filter((key) => staticSkillData[key].type === "NonDamage")
          .filter((key) => staticSkillData[key].maxLevel > 4)
          .map((key) => (
            <NonDamageSkill
              staticSkillData={staticSkillData[key]}
              userInputData={userInputData}
              updateUserInputData={updateUserInputData}
            />
          ))}
      </Grid>
      <Grid container marginTop={2}>
        {Object.keys(staticSkillData)
          .filter((key) => staticSkillData[key].type === "NonDamage")
          .filter((key) => staticSkillData[key].maxLevel === 4)
          .map((key) => (
            <NonDamageSkill
              staticSkillData={staticSkillData[key]}
              userInputData={userInputData}
              updateUserInputData={updateUserInputData}
            />
          ))}
      </Grid>
      <Grid container marginTop={2}>
        {Object.keys(staticSkillData)
          .filter((key) => staticSkillData[key].type === "NonDamage")
          .filter((key) => staticSkillData[key].maxLevel === 3)
          .map((key) => (
            <NonDamageSkill
              staticSkillData={staticSkillData[key]}
              userInputData={userInputData}
              updateUserInputData={updateUserInputData}
            />
          ))}
      </Grid>
      <Grid container marginTop={2}>
        {Object.keys(staticSkillData)
          .filter((key) => staticSkillData[key].type === "NonDamage")
          .filter((key) => staticSkillData[key].maxLevel === 2)
          .map((key) => (
            <NonDamageSkill
              staticSkillData={staticSkillData[key]}
              userInputData={userInputData}
              updateUserInputData={updateUserInputData}
            />
          ))}
      </Grid>
      <Grid container marginTop={2}>
        {Object.keys(staticSkillData)
          .filter((key) => staticSkillData[key].type === "NonDamage")
          .filter((key) => staticSkillData[key].maxLevel === 1)
          .map((key) => (
            <NonDamageSkill
              staticSkillData={staticSkillData[key]}
              userInputData={userInputData}
              updateUserInputData={updateUserInputData}
            />
          ))}
      </Grid>

      {/* Dmax API呼び出し, wasm-dmax-solver の呼び出し, 出力表示を行うコンポーネント*/}
      <DmaxSolver userInputData={userInputData} />
    </div>
  );
}

export default DmaxMain;
