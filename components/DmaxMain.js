import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Card,
  Backdrop,
  SpeedDial,
  SpeedDialAction,
  Autocomplete,
  TextField,
  Divider,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from "@mui/material/Paper";
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

// icons
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import TuneIcon from "@mui/icons-material/Tune";

import { staticSkillData } from "../data/StaticData";
import { userInputData as defaultUserInputData } from "../data/UserInputData";
import SkillCard from "./SkillCard";
// import useCustomStyles from "./CustomStyles";
import { theme } from "./ThemeProvider";
import { SkillAdditionalInput } from "./SkillAdditionalInput";
import SkillColumnHeader from "./SkillColumnHeader";

export const commonStyles = {
  customHeader: {
    padding: "0.25em 0.5em", // 上下 左右の余白
    // color: "#494949", // 文字色
    // background: "transparent", // 背景透明に
    borderLeft: "solid 3px #8798ef", // 左線
    // fontWeight: "bold", // 太字
    marginTop: "1em", // 上の余白
    display: "inline-block", // インライン要素に
    // borderBottom: "solid 1px #7db4e6", // 下線
  },
  customHeaderNoMargin: {
    padding: "0.25em 0.5em", // 上下 左右の余白
    // color: "#494949", // 文字色
    // background: "transparent", // 背景透明に
    borderLeft: "solid 3px #8798ef", // 左線
    // fontWeight: "bold", // 太字
    display: "inline-block", // インライン要素に
    // borderBottom: "solid 1px #7db4e6", // 下線
  },
  customHeaderThin: {
    padding: "0.25em 0.5em", // 上下 左右の余白
    // color: "#494949", // 文字色
    // background: "transparent", // 背景透明に
    borderLeft: "solid 3px #8798ef", // 左線
    marginTop: "1em", // 上の余白
    display: "inline-block", // インライン要素に
    // borderBottom: "solid 1px #7db4e6", // 下線
  },
  customHeaderThinNoMargin: {
    padding: "0.25em 0.5em", // 上下 左右の余白
    // color: "#494949", // 文字色
    // background: "transparent", // 背景透明に
    borderLeft: "solid 3px #8798ef", // 左線
    // marginTop: "1em", // 上の余白
    display: "inline-block", // インライン要素に
    // borderBottom: "solid 1px #7db4e6", // 下線
  },
  customFontSize: {
    fontSize: "10px !important",
  },
  inputCheckbox: {
    fontSize: "14px !important",
  },
};

/**
 * xs: 0px 以上
 * sm: 600px 以上
 * md: 960px 以上
 * lg: 1280px 以上
 * xl: 1920px 以上
 */
export function GridItemInput(props) {
  return <Grid item xs={6} sm={4} md={2} {...props} />;
}

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];

export function DmaxMain({ fabRight, setFabRight }) {
  useEffect(() => {
    return () => {
      console.log("ChildComponent: DmaxMain がアンマウントされました");
    };
  }, []);

  // const classes = useStyles();
  // const classes = useCustomStyles();
  const classes = {};
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

  // SpeedDial 用
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // 追加スキルの管理
  let initAdditionalSkills = localStorage.getItem("additionalSkills");
  if (initAdditionalSkills !== null) {
    initAdditionalSkills = JSON.parse(initAdditionalSkills);
  } else {
    initAdditionalSkills = [];
  }
  const [additionalSkills, setAdditionalSkills] = useState(initAdditionalSkills);
  const [skillSuggestions, setSkillSuggestions] = useState(
    Object.keys(staticSkillData).filter((key) => staticSkillData[key].type === "NonDamage")
  );

  const handleSkillSelect = (event, newValue) => {
    setCurrentSkill(newValue);
    if (newValue === null) return;

    if (!additionalSkills.some((skill) => skill.name === newValue)) {
      setAdditionalSkills((prev) => [...prev, { name: newValue, level: 1 }]);
    }
  };

  // additionalSkills が変更されたら userInputData に反映する
  useEffect(() => {
    for (const skill of additionalSkills) {
      updateUserInputData("スキル", {
        ...userInputData["スキル"],
        [skill.name]: {
          ...userInputData["スキル"][skill.name],
          minLevel: skill.level,
        },
      });
    }
    localStorage.setItem("additionalSkills", JSON.stringify(additionalSkills));
  }, [additionalSkills]);

  // Autoselect のテキストボックスに入力されている値 (onFocus でリセットするために定義)
  const [currentSkill, setCurrentSkill] = useState(null);

  const handleSkillRemove = (indexToRemove) => {
    const skillName = additionalSkills[indexToRemove].name;
    updateUserInputData("スキル", {
      ...userInputData["スキル"],
      [skillName]: {
        ...userInputData["スキル"][skillName],
        minLevel: 0,
      },
    });

    setAdditionalSkills((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const matches = useMediaQuery(theme.breakpoints.down("sm")); // 'sm' は600pxに設定されていることが多い

  return (
    <div className="DmaxMain">
      {/* 読み込みデータの検証 */}
      <ValidateData />

      <Box>
        <Paper variant="outlined" sx={{ borderRadius: 1, padding: 2 }}>
          <Grid container alignItems="center">
            <Grid item>
              <TuneIcon sx={{ marginTop: "4px", marginLeft: "4px" }} color="primary" />
            </Grid>
            <Grid item ml={1}>
              <Typography variant="h6">条件設定</Typography>
            </Grid>
          </Grid>
          <Box sx={{ marginTop: "8px" }}>
            <Divider xs={{ marginTop: "8px" }} />
          </Box>

          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={2}
            marginBottom={1}
            marginLeft={1}
            sx={commonStyles.customHeader}
          >
            モンスター
          </Typography>
          <Grid container rowSpacing={2} columnSpacing={2} paddingX={3}>
            <MonsterSetting
              userInputDataMonster={userInputData["モンスター"]}
              updateUserInputData={updateUserInputData}
            />
          </Grid>
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={4}
            marginBottom={1}
            marginLeft={1}
            sx={commonStyles.customHeader}
          >
            武器
          </Typography>
          <Grid container rowSpacing={2} columnSpacing={2} paddingX={3}>
            <WeaponSetting
              userInputDataWeapon={userInputData["武器"]}
              updateUserInputData={updateUserInputData}
              // fabRight={fabRight}
              // setFabRight={setFabRight}
            />
          </Grid>
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={4}
            marginBottom={1}
            marginLeft={1}
            sx={commonStyles.customHeader}
          >
            ハンター
          </Typography>

          <Grid container rowSpacing={2} columnSpacing={2} paddingX={3}>
            <HunterSetting
              userInputDataHunter={userInputData["ハンター"]}
              updateUserInputData={updateUserInputData}
            />
          </Grid>
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={4}
            marginBottom={1}
            marginLeft={1}
            sx={commonStyles.customHeader}
          >
            食事
          </Typography>

          <Grid container rowSpacing={2} columnSpacing={2} paddingX={3}>
            <DangoSetting
              userInputDataDango={userInputData["食事"]}
              updateUserInputData={updateUserInputData}
            />
          </Grid>
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={4}
            marginBottom={1}
            marginLeft={1}
            sx={commonStyles.customHeader}
          >
            旋律
          </Typography>

          <Grid container rowSpacing={2} columnSpacing={2} paddingX={3}>
            <MelodySetting
              userInputDataMelody={userInputData["旋律"]}
              updateUserInputData={updateUserInputData}
            />
          </Grid>
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={4}
            marginBottom={1}
            marginLeft={1}
            sx={commonStyles.customHeader}
          >
            百竜装飾品
          </Typography>

          <Grid container rowSpacing={2} columnSpacing={2} paddingX={3}>
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
            marginTop={4}
            marginBottom={1}
            marginLeft={1}
            sx={commonStyles.customHeader}
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
          </Grid>

          {matches && (
            <SkillAdditionalInput
              userInputData={userInputData}
              updateUserInputData={updateUserInputData}
            />
          )}

          <Grid container paddingTop={3}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                gutterBottom
                align="left"
                marginTop={4}
                marginBottom={1}
                marginLeft={1}
                sx={commonStyles.customHeader}
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

          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={4}
            marginBottom={1}
            marginLeft={1}
            sx={commonStyles.customHeader}
          >
            その他スキル
          </Typography>
          <Grid container paddingX={1} paddingBottom={6}>
            <Grid item xs={12} md={6} minHeight={"200px"}>
              <Autocomplete
                options={skillSuggestions}
                onChange={handleSkillSelect}
                renderInput={(params) => (
                  <TextField {...params} label="スキル名" variant="outlined" />
                )}
                sx={{ marginY: 2 }}
                size="small"
                value={currentSkill}
                onFocus={() => {
                  // 同じスキルを選択肢した場合に追加できない問題を回避するために, 選択肢をリセットする
                  // [[Autocomplete] onChange not fired for same item consecutively #29159](https://github.com/mui/material-ui/issues/29159)
                  setCurrentSkill("");
                }}
              />

              {additionalSkills.map((skill, index) => (
                <SkillCard
                  key={index}
                  skill={skill}
                  setSelectedSkills={setAdditionalSkills}
                  onRemove={() => handleSkillRemove(index)}
                  allowRemove={true}
                />
              ))}
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Dmax API呼び出し, wasm-dmax-solver の呼び出し, 出力表示を行うコンポーネント*/}
      <DmaxSolver userInputData={userInputData} fabRight={fabRight} />

      {/* <Backdrop open={open} /> */}
      {/* <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{
          position: "fixed",
          bottom: "128px",
          right: `${fabRight}`,
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClose}
          />
        ))}
      </SpeedDial> */}
    </div>
  );
}

export default DmaxMain;
