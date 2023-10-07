import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import { CharmTable } from "./CharmTable";

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

// 列要素対応表
//        0,1,                 2,3,4,5,6
// 火事場力,3,              渾身,2,3,1,1
// 超会心  ,2,              体術,3,3,1,1
// 体術    ,3,通常弾・連射矢強化,2,3,1,1

export function CharmManager() {
  let initUserInputData;
  const cacheUserInputData = localStorage.getItem("userCharmData");
  if (cacheUserInputData !== null) {
    initUserInputData = JSON.parse(cacheUserInputData);
  } else {
    initUserInputData = [];
  }

  // localstorage に保存されるユーザの護石データ
  const [userCharmData, setUserCharmData] = useState(initUserInputData);

  // ユーザが入力した csv データ
  const [csvData, setCsvData] = useState("");
  const handleCsvDataChange = (event) => {
    setCsvData(event.target.value);
  };

  const [tableRows, setTableRows] = useState([]);

  // csv データを処理して, ユーザの護石データを localstorage に登録する関数
  const processCsvData = () => {
    const csvRows = csvData.split("\n").filter((row) => row.trim().replace(/　/g, "") !== "");
    const csvArray = csvRows.map((row) => row.split(","));

    const charmData = [];
    try {
      // csv データの列数が 7 でない列を集めておく
      const errorRows = [];
      for (const [index, row] of csvArray.entries()) {
        if (row.length !== 7) {
          errorRows.push({ lineNumber: index + 1, row: row });
          continue;
        }

        const tempCharm = {
          "rare": 0,
          "type": "charm",
          "deffence": 0,
          "fire": "0",
          "water": "0",
          "ice": "0",
          "thunder": "0",
          "dragon": "0",
          "skills": { [row[0]]: parseInt(row[1]), [row[2]]: parseInt(row[3]) },
          "slots": [parseInt(row[4]), parseInt(row[5]), parseInt(row[6])],
          // 護石【攻撃2, 連撃2】4-1-1 形式で名前を作成
          "name":
            "護石【" +
            row[0] +
            row[1] +
            "，" +
            row[2] +
            row[3] +
            "】" +
            row[4] +
            "-" +
            row[5] +
            "-" +
            row[6],
        };
        charmData.push(tempCharm);
      }

      // csv データの列数が 7 でない列があった場合はエラーを出力
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
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: "100%", whiteSpace: "pre-line", textAlign: "left" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* データ表示 */}
        {/* データ入力欄 */}
        <Grid item xs={10}>
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
          <CharmTable userCharmData={userCharmData} />
        </Grid>
      </Grid>
    </>
  );
}

export default CharmManager;
