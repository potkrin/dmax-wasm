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
  Tooltip,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { NumberTextField } from "./NumberTextField";
import { staticData } from "../data/StaticData";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AddIcon from "@mui/icons-material/Add";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import { theme } from "./ThemeProvider";
import { LDThemeContext } from "./LDThemeContext";

export const SkillAdditionalInput = ({ userInputData, updateUserInputData }) => {
  const handleChangeOther = (key, event, value) => {
    if ((key === "全属性耐性値" || key === "狂竜症") && !value) {
      // TextField から呼び出された場合
      value = parseInt(event.target.value);
    } else {
      value = event.target.value;
    }

    updateUserInputData("その他", { ...userInputData["その他"], [key]: value });
  };

  // const skillInput = userInputData["スキル"][staticSkillData.name];

  const matches = useMediaQuery(theme.breakpoints.down("sm")); // 'sm' は600pxに設定されていることが多い

  const { currentTheme } = React.useContext(LDThemeContext);

  return (
    <>
      {/* 追加で入力項目が必要なスキルの処理 */}
      <Grid container rowSpacing={2} columnSpacing={2} paddingX={3}>
        <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "center" }}>
          <NumberTextField
            label="全属性耐性合計"
            size="small"
            value={userInputData["その他"]["全属性耐性値"]}
            onChange={(e, v) => handleChangeOther("全属性耐性値", e, v)}
            min={0}
            max={250}
            sx={{ minWidth: "100px" }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "center" }}>
          <NumberTextField
            label="狂竜症感染率"
            size="small"
            value={userInputData["その他"]["狂竜症【蝕】感染時割合"]}
            onChange={(e, v) => handleChangeOther("狂竜症【蝕】感染時割合", e, v)}
            min={0}
            max={100}
            sx={{ minWidth: "100px" }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "center" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">キュリア</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              value={userInputData["その他"]["キュリア"]}
              label={"キュリア"}
              onChange={(e) => handleChangeOther("キュリア", e)}
              // sx={{ ...(matches && { maxHeight: "30px" }) }}
            >
              {Object.entries(staticData["その他"]["キュリア"]).map(([_, value]) => (
                <MenuItem value={value}>{value}匹</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "center" }}>
          <FormControl fullWidth>
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
      </Grid>
    </>
  );
};

export default SkillAdditionalInput;
