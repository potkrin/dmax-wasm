import logo from "./logo.svg";
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import {
  Container,
  Typography,
  Grid,
  Switch,
  Box,
  Slider,
  TextField,
  Button,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";

import Skill from "./components/Skill";
import NonDamageSkill from "./components/NonDamageSkill";
import { MonsterSetting } from "./components/MonsterSetting";
import { WeaponSetting } from "./components/WeaponSetting";
import { HunterSetting } from "./components/HunterSetting";
import { DangoSetting } from "./components/DangoSetting";
import { MelodySetting } from "./components/MelodySetting";
import { RampageDecoSetting } from "./components/RampageDecoSetting";

import { DmaxSolver } from "./components/DmaxSolver";

import { skillData } from "./data/SkillData";
import { UserInputData } from "./data/UserInputData";

/**
 * TODO:
 *   - スキルの検索ボックス。文字列がヒットしたもののみ残る
 *   - state 更新の軽量化
 */

// initSkillData: skillData の各オブジェクトに新しい key-value を追加したデータ構造
const initSkillData = Object.keys(skillData).reduce((acc, key) => {
  // // Slider が必要なスキル以外はスキップ
  // if (skillData[key].type === "NonDamage") {
  //   return acc;
  // }

  acc[key] = {
    ...skillData[key],
    activeRate: 100,
    fixLevel: false,
    minLevel: 0,
  };
  return acc;
}, {});

function App() {
  // 各スキルのデータを保持
  const [skillData, setSkillData] = useState(initSkillData);

  const updateSkillInfo = (key, value) => {
    setSkillData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // スキル以外のユーザ入力データを保持
  const [userInputData, setUserInputData] = useState(UserInputData);

  const updateUserInputData = (key, value) => {
    setUserInputData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // デバッグ用: 更新されるたびに表示
  useEffect(() => {
    console.log("useEffect userInputData:\n" + JSON.stringify(userInputData, null, 4));
  }, [skillData]);

  // デバッグ用: 更新されるたびに表示
  useEffect(() => {
    console.log("useEffect userInputData:\n" + JSON.stringify(userInputData, null, 4));
  }, [userInputData]);

  return (
    <div className="App">
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
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "FixedLevelDamage")
            .map((key) => (
              <Skill
                skillInfo={skillData[key]}
                userInputData={userInputData}
                updateUserInputData={updateUserInputData}
              />
            ))}
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "Damage")
            .map((key) => (
              <Skill
                skillInfo={skillData[key]}
                userInputData={userInputData}
                updateUserInputData={updateUserInputData}
              />
            ))}
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "FreqNonDamage")
            .map((key) => (
              <Skill
                skillInfo={skillData[key]}
                userInputData={userInputData}
                updateUserInputData={updateUserInputData}
              />
            ))}
        </Grid>

        {/* スライダーなしのスキル 最大Lv5以上, Lv4, Lv3, ... */}
        <Grid container marginTop={2}>
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "NonDamage")
            .filter((key) => skillData[key].maxLevel > 4)
            .map((key) => (
              <NonDamageSkill skillInfo={skillData[key]} updateSkillInfo={updateSkillInfo} />
            ))}
        </Grid>
        <Grid container marginTop={2}>
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "NonDamage")
            .filter((key) => skillData[key].maxLevel === 4)
            .map((key) => (
              <NonDamageSkill skillInfo={skillData[key]} updateSkillInfo={updateSkillInfo} />
            ))}
        </Grid>
        <Grid container marginTop={2}>
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "NonDamage")
            .filter((key) => skillData[key].maxLevel === 3)
            .map((key) => (
              <NonDamageSkill skillInfo={skillData[key]} updateSkillInfo={updateSkillInfo} />
            ))}
        </Grid>
        <Grid container marginTop={2}>
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "NonDamage")
            .filter((key) => skillData[key].maxLevel === 2)
            .map((key) => (
              <NonDamageSkill skillInfo={skillData[key]} updateSkillInfo={updateSkillInfo} />
            ))}
        </Grid>
        <Grid container marginTop={2}>
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "NonDamage")
            .filter((key) => skillData[key].maxLevel === 1)
            .map((key) => (
              <NonDamageSkill skillInfo={skillData[key]} updateSkillInfo={updateSkillInfo} />
            ))}
        </Grid>

        {/* Dmax API呼び出し, wasm-dmax-solver の呼び出し, 出力表示を行うコンポーネント*/}
        <DmaxSolver userInputData={userInputData} />
      </Container>
    </div>
  );
}

export default App;
