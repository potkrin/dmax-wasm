import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import { armorDict } from "../data/EquipData";
import { staticSkillData } from "../data/StaticData";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function MultiLineTextComponent({ text }) {
  return (
    <Typography variant="body1" style={{ whiteSpace: "pre-line", textAlign: "left" }}>
      {text}
    </Typography>
  );
}

export function QuriousArmorManager() {
  // localstorage に保存されるユーザの傀異錬成防具データ
  const [userQuriousArmorData, setUserQuriousArmorData] = useState([]);

  // ユーザが入力した csv データ
  const [csvData, setCsvData] = useState("");
  const handleCsvDataChange = (event) => {
    setCsvData(event.target.value);
  };

  // csv データを処理して, ユーザの護石データを localstorage に登録する関数
  const processCsvData = () => {
    const csvRows = csvData.split("\n");
    const csvArray = csvRows.map((row) => row.split(","));

    const quriousArmorData = [];
    try {
      for (const row of csvArray) {
        console.log("process array = " + row);
        if (row.length <= 20) {
          row.push(...Array(20 - row.length).fill(""));
        } else {
          throw new Error("CSV データの列数が不正です。\n" + row);
        }

        // csv_row_string := 元の csv形式のファイルの一行の表現
        //
        // 列要素対応表
        //     0           ,  1,2,3,4, 5,6,7,8,9,  10,11,      12,13,14,15,16,17,18,19
        //     ゼクスヘルム,-11,0,0,0,-3,0,0,0,0,攻撃, 2,気絶耐性,-1,  ,  ,  ,  ,  ,

        //         str(ba['deffence'])     + int_to_str(int(csv_row[1]))
        // + ' 火:' + ba['fire']    + int_to_str(int(csv_row[2]))
        // + ' 水:' + ba['water']   + int_to_str(int(csv_row[3]))
        // + ' 雷:' + ba['thunder'] + int_to_str(int(csv_row[4]))
        // + ' 氷:' + ba['ice']     + int_to_str(int(csv_row[5]))
        // + ' 龍:' + ba['dragon']  + int_to_str(int(csv_row[6]))
        //{"rare":1,"type":"head","name":"カムラノ装【頭巾】","deffence":1,"fire":"1","water":"0","ice":"0","thunder":"0","dragon":"0","slots":[],"skills":{"精霊の加護":1}},

        // armorName = row[0];
        // # 名前作成 防具名(スキルA+N, ))
        // aug_name = augment[0] + '('
        // for i in range(5):
        //     # 元データのcsvが短い場合 continue
        //     if 10+2*i+1 >= len(augment):
        //         continue
        //     # print(f'augment[{10+2*i}] = {augment[10+2*i]}')
        //     skill_name = augment[10+2*i]
        //     if skill_name == '':
        //         continue

        //     diff_level = int(augment[10+2*i+1])
        //     if diff_level >= 0:
        //         aug_name += skill_name + '+' + str(diff_level)
        //     else:
        //         aug_name += skill_name + str(diff_level)

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
    } catch (err) {
      setError(err.message);
      setOpen(true);
    }
    setUserQuriousArmorData(quriousArmorData);
    localStorage.setItem("userQuriousArmorData", JSON.stringify(quriousArmorData));
  };

  // エラー出力用 Snackbar 管理
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // デバッグ用
  useEffect(() => {
    console.log("QuriousArmorManager: useEffect: csvData", csvData);
  }, [csvData]);

  // デバッグ用
  useEffect(() => {
    console.log(
      "QuriousArmorManager: useEffect: userQuriousArmorData\n",
      JSON.stringify(userQuriousArmorData, null, 4)
    );
  }, [userQuriousArmorData]);

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
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* データ表示 */}
        <Grid item xs={6}>
          <MultiLineTextComponent text={localStorage.getItem("userQuriousArmorData")} />
        </Grid>
        {/* データ入力欄 */}
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
      </Grid>
    </>
  );
}

export default QuriousArmorManager;
