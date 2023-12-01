import React from "react";
import {
  Typography,
  Grid,
  Box,
  Slider,
  TextField,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Divider,
  Paper,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { NumberTextField } from "./NumberTextField";
import { staticData } from "../data/StaticData";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { theme } from "./ThemeProvider";
import { LDThemeContext } from "./LDThemeContext";

// import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles((theme) => ({
//   row: {
//     // padding: theme.spacing(1),
//     "&:hover": {
//       backgroundColor: theme.palette.action.hover, // ホバー時の背景色
//     },
//   },
// }));

export const Skill = ({ staticSkillData, userInputData, updateUserInputData }) => {
  // const classes = useStyles();

  const handleChangeSkillInfo = (key, event, value) => {
    if (key === "activeRate" && !value) {
      // TextField から呼び出された場合
      value = parseInt(event.target.value);
    }
    if (key === "fixLevel") {
      // CheckBox から呼び出された場合
      value = event.target.checked;
    }
    updateUserInputData("スキル", {
      ...userInputData["スキル"],
      [staticSkillData.name]: {
        ...userInputData["スキル"][staticSkillData.name],
        [key]: value,
      },
    });
  };

  const handleChangeOther = (key, event, value) => {
    if ((key === "全属性耐性値" || key === "狂竜症") && !value) {
      // TextField から呼び出された場合
      value = parseInt(event.target.value);
    } else {
      value = event.target.value;
    }

    updateUserInputData("その他", { ...userInputData["その他"], [key]: value });
  };

  const skillInput = userInputData["スキル"][staticSkillData.name];

  const buttonSize = "28px";
  const buttonSize2 = "24px";

  const matches = useMediaQuery(theme.breakpoints.down("sm")); // 'sm' は600pxに設定されていることが多い

  const { currentTheme } = React.useContext(LDThemeContext);

  return (
    <>
      <Grid container mt={0.5} marginX={3}>
        {staticSkillData.type !== "FixedLevelDamage" ? (
          <Grid
            item
            xs={1}
            md={0.5}
            // sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}
            sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}
          >
            <Checkbox
              checked={skillInput.fixLevel}
              onChange={(e, v) => handleChangeSkillInfo("fixLevel", e, v)}
              size="small"
              sx={{ alignItems: "center", marginTop: -0.8 }}
            />
          </Grid>
        ) : (
          <Grid item xs={1} md={0.5}></Grid>
        )}

        <Grid item xs={6} md={2.8}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              sx={{
                textAlign: "left",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              {staticSkillData.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: currentTheme.palette.secondary.main,
                textAlign: "left",
                display: "flex",
                alignItems: "flex-start",
                marginLeft: 1,
              }}
            >
              {skillInput.minLevel > 0 ? `Lv.${skillInput.minLevel}` : ""}
            </Typography>
          </Box>
          {!matches ? (
            <Box sx={{ width: 30 * staticSkillData.maxLevel, mt: -1, ml: 0.5 }}>
              <Slider
                aria-label="Temperature"
                value={skillInput.minLevel}
                valueLabelDisplay="auto"
                step={1}
                marks={Array.from({ length: staticSkillData.maxLevel + 1 }, (_, level) => ({
                  value: level,
                }))}
                min={0}
                max={staticSkillData.maxLevel}
                onChange={(e, v) => handleChangeSkillInfo("minLevel", e, v)}
                size="small"
                sx={{
                  "& .MuiSlider-mark": {
                    borderRadius: "2px",
                    height: "4px",
                    width: "4px",
                    color:
                      skillInput.minLevel > 0
                        ? currentTheme.palette.primary.main
                        : currentTheme.palette.text.hint,
                    "&.MuiSlider-markActive": {
                      opacity: 1,
                      backgroundColor: "currentColor",
                    },
                  },

                  "& .MuiSlider-rail": {
                    height: "3px",
                    color:
                      skillInput.minLevel > 0
                        ? currentTheme.palette.primary.main
                        : currentTheme.palette.text.hint,
                  },
                  "& .MuiSlider-thumb": {
                    borderRadius: "1px",
                    width: "10px",
                    height: "10px",
                    color:
                      skillInput.minLevel > 0
                        ? currentTheme.palette.primary.main
                        : currentTheme.palette.text.hint,
                  },
                }}
              />
            </Box>
          ) : (
            <>
              <IconButton
                onClick={(e, v) =>
                  handleChangeSkillInfo(
                    "minLevel",
                    e,
                    skillInput.minLevel - 1 >= 0 ? skillInput.minLevel - 1 : 0
                  )
                }
                sx={{ marginTop: -1 }}
              >
                <IndeterminateCheckBoxOutlinedIcon sx={{ width: buttonSize, height: buttonSize }} />
              </IconButton>
              <IconButton
                onClick={(e, v) =>
                  handleChangeSkillInfo(
                    "minLevel",
                    e,
                    skillInput.minLevel + 1 <= staticSkillData.maxLevel
                      ? skillInput.minLevel + 1
                      : staticSkillData.maxLevel
                  )
                }
                sx={{ marginTop: -1, marginLeft: 1 }}
              >
                <AddBoxOutlinedIcon sx={{ width: buttonSize, height: buttonSize }} />
              </IconButton>
            </>
          )}
        </Grid>

        {/* {matches && (
          <Grid
            item
            xs={2}
            md={1.5}
            sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}
          >
            <IconButton
              onClick={(e, v) =>
                handleChangeSkillInfo(
                  "minLevel",
                  e,
                  skillInput.minLevel - 1 >= 0 ? skillInput.minLevel - 1 : 0
                )
              }
              sx={{ marginTop: -1 }}
            >
              <IndeterminateCheckBoxOutlinedIcon sx={{ width: buttonSize, height: buttonSize }} />
            </IconButton>
            <IconButton
              onClick={(e, v) =>
                handleChangeSkillInfo(
                  "minLevel",
                  e,
                  skillInput.minLevel + 1 <= staticSkillData.maxLevel
                    ? skillInput.minLevel + 1
                    : staticSkillData.maxLevel
                )
              }
              sx={{ marginTop: -1, marginLeft: 1 }}
            >
              <AddBoxOutlinedIcon sx={{ width: buttonSize, height: buttonSize }} />
            </IconButton>
          </Grid>
        )} */}

        {staticSkillData.type === "Damage" ? (
          <>
            <Grid
              item
              xs={2}
              md={1}
              sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}
            >
              <Box>
                <Box>
                  <NumberTextField
                    value={skillInput.activeRate}
                    size="small"
                    id="outlined-basic"
                    variant="standard"
                    onChange={(e, v) => handleChangeSkillInfo("activeRate", e, v)}
                    min={0}
                    max={100}
                    inputProps={{
                      style: { textAlign: "center", paddingLeft: "16px" },
                      // endAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                    // sx={{ display: "flex", alignItems: "center", height: "100%", marginY: 1 }}
                    sx={{
                      marginBottom: -0.5,
                      "& .MuiInput-underline:hover:before": {
                        borderBottom: "none", // ホバー時の下線を非表示
                      },
                      "& .MuiInput-underline:after": {
                        borderBottom: "none", // フォーカス時の下線を非表示
                      },
                      "& .MuiInput-underline:before": {
                        borderBottom: "none", // デフォルトの下線を非表示
                      },
                    }}
                  />
                  {/* <IconButton
                    onClick={(e, v) =>
                      handleChangeSkillInfo(
                        "minLevel",
                        e,
                        skillInput.minLevel - 1 >= 0 ? skillInput.minLevel - 1 : 0
                      )
                    }
                    sx={{ marginTop: -1 }}
                  >
                    <RemoveIcon sx={{ width: buttonSize2, height: buttonSize2 }} />
                  </IconButton>
                  <IconButton
                    onClick={(e, v) =>
                      handleChangeSkillInfo(
                        "minLevel",
                        e,
                        skillInput.minLevel + 1 <= staticSkillData.maxLevel
                          ? skillInput.minLevel + 1
                          : staticSkillData.maxLevel
                      )
                    }
                    sx={{ marginTop: -1, marginLeft: 1 }}
                  >
                    <AddIcon sx={{ width: buttonSize2, height: buttonSize2 }} />
                  </IconButton> */}
                </Box>
                <Slider
                  value={skillInput.activeRate}
                  size="small"
                  aria-label="Temperature"
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  sx={{
                    marginTop: "-8px",
                    "& .MuiSlider-rail": {
                      color:
                        skillInput.activeRate > 0
                          ? currentTheme.palette.primary.main
                          : currentTheme.palette.text.disabled,
                    },
                    "& .MuiSlider-thumb": {
                      width: "8px",
                      height: "8px",
                      color:
                        skillInput.activeRate > 0
                          ? currentTheme.palette.primary.main
                          : currentTheme.palette.text.disabled,
                    },
                  }}
                  onChange={(e, v) => handleChangeSkillInfo("activeRate", e, v)}
                />
              </Box>
            </Grid>
            {/* <Grid item xs={2} md={1}>
              <NumberTextField
                value={skillInput.activeRate}
                size="small"
                id="outlined-basic"
                variant="standard"
                onChange={(e, v) => handleChangeSkillInfo("activeRate", e, v)}
                min={0}
                max={100}
                // InputProps={{
                //   endAdornment: <InputAdornment position="start">%</InputAdornment>,
                // }}
                sx={{ display: "flex", alignItems: "center", height: "100%", marginY: 1 }}
              />
            </Grid> */}
          </>
        ) : (
          <Grid item xs={4} md={2}></Grid>
        )}

        {/* <Grid item md={4}>
        <Box sx={{ width: 50 * staticSkillData.maxLevel }}>
          <Slider
            aria-label="Temperature"
            value={skillInput.minLevel}
            valueLabelDisplay="auto"
            step={1}
            marks={Array.from({ length: staticSkillData.maxLevel + 1 }, (_, level) => ({
              value: level,
              label: String(level),
            }))}
            min={0}
            max={staticSkillData.maxLevel}
            onChange={(e, v) => handleChangeSkillInfo("minLevel", e, v)}
            size="small"
          />
        </Box>
      </Grid> */}

        {/* 追加で入力項目が必要なスキルの処理 */}
        {staticSkillData.name === "龍気変換" ? (
          <Grid item xs md={2} sx={{ display: "flex", justifyContent: "center" }}>
            <NumberTextField
              label="全属性耐性合計"
              size="small"
              value={userInputData["その他"]["全属性耐性値"]}
              onChange={(e, v) => handleChangeOther("全属性耐性値", e, v)}
              min={0}
              max={250}
            />
          </Grid>
        ) : staticSkillData.name === "狂竜症【蝕】" ? (
          <Grid item xs={2} md={2} sx={{ display: "flex", justifyContent: "center" }}>
            <NumberTextField
              label="狂竜症感染率"
              size="small"
              value={userInputData["その他"]["狂竜症【蝕】感染時割合"]}
              onChange={(e, v) => handleChangeOther("狂竜症【蝕】感染時割合", e, v)}
              min={0}
              max={100}
            />
          </Grid>
        ) : staticSkillData.name === "伏魔響命" ? (
          <Grid item xs md={2} sx={{ display: "flex", justifyContent: "center" }}>
            <FormControl style={{ width: "101px" }}>
              <InputLabel id="demo-simple-select-label">キュリア</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size="small"
                value={userInputData["その他"]["キュリア"]}
                label={"キュリア"}
                onChange={(e) => handleChangeOther("キュリア", e)}
              >
                {Object.entries(staticData["その他"]["キュリア"]).map(([_, value]) => (
                  <MenuItem value={value}>{value}匹</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ) : staticSkillData.name === "血氣覚醒" ? (
          <Grid item xs md={2} sx={{ display: "flex", justifyContent: "center" }}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">血氣覚醒</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size="small"
                value={userInputData["その他"]["血氣覚醒"]}
                label={"血氣覚醒"}
                onChange={(e) => handleChangeOther("血氣覚醒", e)}
              >
                {Object.entries(staticData["その他"]["血氣覚醒"]).map(([_, value]) => (
                  <MenuItem value={value}>{value}段階目</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ) : (
          <Grid item xs md={2}></Grid>
        )}
        {/* <Grid item md={5.4}></Grid> */}

        {/* <Grid item md={2}></Grid>
        <Grid item md={10}>
          <Divider />
        </Grid> */}
      </Grid>
    </>
  );
};

export default Skill;
