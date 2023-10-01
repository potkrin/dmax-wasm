import React, { useState, useEffect } from "react";
import "./App.css";
import { Container, Grid } from "@mui/material";

import { Skill } from "./components/Skill";
import { NonDamageSkill } from "./components/NonDamageSkill";
import { MonsterSetting } from "./components/MonsterSetting";
import { WeaponSetting } from "./components/WeaponSetting";
import { HunterSetting } from "./components/HunterSetting";
import { DangoSetting } from "./components/DangoSetting";
import { MelodySetting } from "./components/MelodySetting";
import { RampageDecoSetting } from "./components/RampageDecoSetting";
import { DmaxSolver } from "./components/DmaxSolver";
import { ValidateData } from "./components/ValidateData";

import { staticSkillData } from "./data/StaticData";
import { userInputData as initUserInputData } from "./data/UserInputData";

/**
 * TODO:
 *   - スキルの検索ボックス。文字列がヒットしたもののみ残る
 *   - state 更新の軽量化
 */

function App() {
  // スキル以外のユーザ入力データを保持
  const [userInputData, setUserInputData] = useState(initUserInputData);

  const updateUserInputData = (key, value) => {
    setUserInputData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // デバッグ用: 更新されるたびに表示
  useEffect(() => {
    console.log("useEffect userInputData:\n" + JSON.stringify(userInputData, null, 4));
  }, [userInputData]);

  return (
    <div className="App">
      {/* 読み込みデータの検証 */}
      <ValidateData />

      <Container sx={{ marginY: 5 }}>
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
      </Container>
    </div>
  );
}

export default App;
