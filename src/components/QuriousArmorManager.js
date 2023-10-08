import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import { armorDict } from "../data/EquipData";
import { staticSkillData } from "../data/StaticData";
import { QuriousArmorTable } from "./QuriousArmorTable";
import QuriousArmorInput from "./QuriousArmorInput";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function QuriousArmorManager() {
  let initUserInputData;
  const cacheUserInputData = localStorage.getItem("userQuriousArmorData");
  if (cacheUserInputData !== null) {
    initUserInputData = JSON.parse(cacheUserInputData);
  } else {
    initUserInputData = [];
  }

  // localstorage に保存されるユーザの傀異錬成防具データ
  const [userQuriousArmorData, setUserQuriousArmorData] = useState(initUserInputData);

  useEffect(() => {
    localStorage.setItem("userQuriousArmorData", JSON.stringify(userQuriousArmorData));
  }, [userQuriousArmorData]);

  // ユーザが入力した csv データ
  const [csvData, setCsvData] = useState("");
  const handleCsvDataChange = (event) => {
    setCsvData(event.target.value);
  };

  // csv データを処理して, ユーザの護石データを localstorage に登録する関数
  const processCsvData = () => {
    // csv データを行ごとに分割し, 余分な空白行は削除する
    const csvRows = csvData.split("\n").filter((row) => row.trim().replace(/　/g, "") !== "");
    const csvArray = csvRows.map((row) => row.split(","));

    const quriousArmorData = [];
    try {
      const errorRows = [];
      for (const [index, row] of csvArray.entries()) {
        console.log("process array = " + row);
        if (10 < row.length && row.length <= 20) {
          row.push(...Array(20 - row.length).fill(""));
        } else {
          errorRows.push({ lineNumber: index + 1, row: row });
          continue;
        }

        // 列要素対応表
        //     0           ,  1,2,3,4, 5,6,7,8,9,  10,11,      12,13,14,15,16,17,18,19
        //     ゼクスヘルム,-11,0,0,0,-3,0,0,0,0,攻撃, 2,気絶耐性,-1,  ,  ,  ,  ,  ,

        const tempArmor = JSON.parse(JSON.stringify(armorDict[row[0]]));
        console.log("tempArmor = " + JSON.stringify(tempArmor, null, 4));
        tempArmor["deffence"] += parseInt(row[1]);
        tempArmor["fire"] = parseInt(tempArmor["fire"]) + parseInt(row[2]);
        tempArmor["water"] = parseInt(tempArmor["water"]) + parseInt(row[3]);
        tempArmor["ice"] = parseInt(tempArmor["ice"]) + parseInt(row[4]);
        tempArmor["thunder"] = parseInt(tempArmor["thunder"]) + parseInt(row[5]);
        tempArmor["dragon"] = parseInt(tempArmor["dragon"]) + parseInt(row[6]);

        // スロット差分処理
        for (let i = 0; i < 3; i++) {
          if (tempArmor["slots"][0 + i]) {
            tempArmor["slots"][0 + i] += parseInt(row[7 + i]);
          } else {
            tempArmor["slots"][0 + i] = parseInt(row[7 + i]);
          }
        }
        // スキル差分処理
        for (let i = 0; i < 5; i++) {
          console.log("row[10 + 2 * i] = " + row[10 + 2 * i]);
          if (!(tempArmor["skills"][row[10 + 2 * i]] in staticSkillData)) {
            console.log("continue");
            continue;
          }

          if (row[10 + i] in tempArmor["skills"])
            tempArmor["skills"][row[10 + 2 * i]] += parseInt(row[11 + 2 * i]);
          else tempArmor["skills"][row[10 + 2 * i]] = parseInt(row[11 + 2 * i]);
        }

        // 名前作成 防具名(スキルA+N, スキルB-N, スロット+M))
        let armorName = row[0] + " (";
        for (let i = 0; i < 5; i++) {
          const skillName = row[10 + 2 * i];
          if (!(skillName in staticSkillData)) continue;

          armorName += skillName;

          const skillLevel = parseInt(row[11 + 2 * i]);
          armorName += (parseInt(skillLevel) > 0 ? "+" + skillLevel : skillLevel) + ",";
        }

        let slotSum = 0;
        for (let i = 0; i < 3; i++) {
          slotSum += parseInt(row[7 + i]);
        }
        armorName += "スロット" + (slotSum > 0 ? "+" + slotSum : slotSum) + ")";

        tempArmor["name"] = armorName;

        quriousArmorData.push(tempArmor);
      }

      // csv データの列数が 20 でない列があった場合はエラーを出力
      if (errorRows.length > 0) {
        let errorMessage = "CSV データの列数が不正です。\n";
        for (const errorRow of errorRows) {
          errorMessage += `${errorRow["lineNumber"]}: ${errorRow["row"]}\n`;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      setError(err.message);
      setOpen(true);
    }
    setUserQuriousArmorData(quriousArmorData);
  };

  // エラー出力用 Snackbar 管理
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* エラー出力 */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={error}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: "100%", whiteSpace: "pre-line", textAlign: "left" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* データ入力欄 */}
        <Grid item xs={12}>
          <QuriousArmorInput
            userQuriousArmorData={userQuriousArmorData}
            setUserQuriousArmorData={setUserQuriousArmorData}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="CSV"
            multiline
            rows={4}
            variant="outlined"
            value={csvData}
            onChange={handleCsvDataChange}
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" onClick={processCsvData}>
            読み込み
          </Button>
        </Grid>
        <Grid item xs={12}>
          <QuriousArmorTable userQuriousArmorData={userQuriousArmorData} />
        </Grid>
      </Grid>
    </>
  );
}

export default QuriousArmorManager;
