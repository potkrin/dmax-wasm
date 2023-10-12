import React, { useState, useEffect } from "react";
import { Divider, Grid, Typography, Box, Card } from "@mui/material";
import { makeStyles } from "@mui/styles";

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

const useStyles = makeStyles({
  customHeader: {
    padding: "0.25em 0.5em", // 上下 左右の余白
    color: "#494949", // 文字色
    background: "transparent", // 背景透明に
    borderLeft: "solid 5px #7db4e6", // 左線
    fontWeight: "bold", // 太字
    marginTop: "1em", // 上の余白
    display: "inline-block", // インライン要素に
    borderBottom: "solid 1px #7db4e6", // 下線
  },
});

export function DmaxMain() {
  const classes = useStyles();
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

      <Box sx={{ backgroundColor: "#f3f6f9" }}>
        <Card variant="outlined" sx={{ borderRadius: 4 }} backgroundColor="#f5f5f5">
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={2}
            marginLeft={2}
            className={classes.customHeader}
          >
            モンスター
          </Typography>
          <Grid container spacing={0.5} marginY={1} marginLeft={2}>
            <MonsterSetting
              userInputDataMonster={userInputData["モンスター"]}
              updateUserInputData={updateUserInputData}
            />
          </Grid>
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={2}
            marginLeft={2}
            className={classes.customHeader}
          >
            武器
          </Typography>
          <Grid container spacing={0.5} marginY={1} marginLeft={2}>
            <WeaponSetting
              userInputDataWeapon={userInputData["武器"]}
              updateUserInputData={updateUserInputData}
            />
          </Grid>
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={2}
            marginLeft={2}
            className={classes.customHeader}
          >
            ハンター
          </Typography>

          <Grid container spacing={1} marginY={1} marginLeft={2}>
            <HunterSetting
              userInputDataHunter={userInputData["ハンター"]}
              updateUserInputData={updateUserInputData}
            />
          </Grid>
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={2}
            marginLeft={2}
            className={classes.customHeader}
          >
            食事
          </Typography>

          <Grid container spacing={1} marginY={1} marginLeft={2}>
            <DangoSetting
              userInputDataDango={userInputData["食事"]}
              updateUserInputData={updateUserInputData}
            />
          </Grid>
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={2}
            marginLeft={2}
            className={classes.customHeader}
          >
            旋律
          </Typography>

          <Grid container spacing={1} marginY={1} marginLeft={2}>
            <MelodySetting
              userInputDataMelody={userInputData["旋律"]}
              updateUserInputData={updateUserInputData}
            />
          </Grid>
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={2}
            marginLeft={2}
            className={classes.customHeader}
          >
            百竜装飾品
          </Typography>

          <Grid container spacing={1} marginY={0} marginLeft={2}>
            <RampageDecoSetting
              userInputDataRampageDeco={userInputData["百竜装飾品"]}
              updateUserInputData={updateUserInputData}
            />
          </Grid>
          {/* スライダーありのスキル */}
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginLeft={2}
            className={classes.customHeader}
          >
            ダメージスキル
          </Typography>

          <Grid container>
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
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                gutterBottom
                align="left"
                marginLeft={2}
                className={classes.customHeader}
              >
                よく使うスキル
              </Typography>
            </Grid>
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
        </Card>
      </Box>

      {/* Dmax API呼び出し, wasm-dmax-solver の呼び出し, 出力表示を行うコンポーネント*/}
      <DmaxSolver userInputData={userInputData} />
    </div>
  );
}

export default DmaxMain;
