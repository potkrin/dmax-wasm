import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import { staticSkillData } from "../data/StaticData";
import { userInputData as initUserInputData } from "../data/UserInputData";

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

/**
 *
 *
 *
 *
 **/

// temp_charm = {
//   "rare": 0,
//   "type": "charm",
//   // 護石【攻撃2, 連撃2】4-1-1 形式で名前を作成
//   "name":
//     "護石【" +
//     charm[0] +
//     charm[1] +
//     "，" +
//     charm[2] +
//     charm[3] +
//     "】" +
//     charm[4] +
//     "-" +
//     charm[5] +
//     "-" +
//     charm[6],
//   "deffence": 0,
//   "fire": "0",
//   "water": "0",
//   "ice": "0",
//   "thunder": "0",
//   "dragon": "0",
//   "slots": [],
//   "skills": {},
// };

// 護石の csv  ファイルの一行をリスト形式で受け取り, table に insert する関数
//
// csv_row_string := 元の csv形式のファイルの一行の表現
//
// 列要素対応表
//        0,1,                 2,3,4,5,6
// 火事場力,3,              渾身,2,3,1,1
// 超会心  ,2,              体術,3,3,1,1
// 体術    ,3,通常弾・連射矢強化,2,3,1,1

// charm_json = {
//   "1stSkill": { "name": 火事場力, "level": 3 },
//   "2ndSkill": { "name": 渾身, "level": 2 },
//   "slot": [1, 1, 1],
// };

// TODO:
//   - エラー処理のコンポーネント分離 (snackbar)
//   - 入力されたデータの検証 (数字以外, 空文字)

export function CharmManager() {
  // localstorage に保存されるユーザの護石データ
  const [userCharmData, setUserCharmData] = useState([]);

  // ユーザが入力した csv データ
  const [csvData, setCsvData] = useState("");
  const handleCsvDataChange = (event) => {
    setCsvData(event.target.value);
  };

  // csv データを処理して, ユーザの護石データを localstorage に登録する関数
  const processCsvData = () => {
    const csvRows = csvData.split("\n");
    const csvArray = csvRows.map((row) => row.split(","));

    let charmData = [];
    try {
      for (const row of csvArray) {
        if (row.length !== 7) {
          throw new Error("CSV データの列数が不正です。\n" + row);
        }
        charmData.push({
          "1stSkill": { "name": row[0], "level": parseInt(row[1]) },
          "2ndSkill": { "name": row[2], "level": parseInt(row[3]) },
          "slots": [parseInt(row[4]), parseInt(row[5]), parseInt(row[6])],
        });
      }
    } catch (err) {
      setError(err.message);
      setOpen(true);
    }
    setUserCharmData(charmData);
    localStorage.setItem("userCharmData", JSON.stringify(charmData));
  };

  // エラー出力用 Snackbar 管理
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // デバッグ用
  useEffect(() => {
    console.log("CharmManager: useEffect: csvData", csvData);
  }, [csvData]);

  // デバッグ用
  useEffect(() => {
    console.log("CharmManager: useEffect: userCharmData\n", JSON.stringify(userCharmData, null, 4));
  }, [userCharmData]);

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
          <MultiLineTextComponent text={localStorage.getItem("userCharmData")} />
        </Grid>
        {/* データ入力欄 */}
        <Grid item xs={6}>
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

export default CharmManager;
