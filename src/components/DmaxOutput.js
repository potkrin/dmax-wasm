import React, { useRef, useEffect, useState } from "react";
import { Grid, Paper, Box, Card } from "@mui/material";
import MiddleOutput from "./MiddleOutput";

/**
ここに webworker や wasm の起動状況を表示する
起動完了, エラー, サポートされていないブラウザ など

{
  "load": {
    "title": "ロード",
    "status": "waiting", "done", "running", "complete", "error",
    "message": "元問題 変数: 2200, 制約式: 241"
  }
  "preprocess": {
    "title": "前処理",
    "status": "waiting", "done", "running", "complete", "error",
    "message": "round 10, exhaustive) 削除変数: 1365, 削除制約式: 183, 追加制約式: 993, 範囲変更: 2467, 係数変更: 1943, 制約改善: 51"
  }
}

アイコン: タイトル
  メッセージ  (リアルタイム更新)

x [ロード]
    元問題 変数: 2200, 制約式: 241
x [前処理中...]
    (round 10, exhaustive) 削除変数: 1365, 削除制約式: 183, 追加制約式: 993, 範囲変更: 2467, 係数変更: 1943, 制約改善: 51
o [前処理完了]
    前処理時間:  4秒, 変数: 1622, 制約式: 1051
  [並列ソルバ起動]
    1 2 3
  [最適化中...]
    18秒, 使用メモリ:  71MB, ダメージ上界: 170.57, ダメージ下界: 170.57, ギャップ:    0.00%
  [最適化終了]
    最適化完了: 最適解が見つかりました
    合計処理時間 : 18秒

 */

const defaultMiddleOutputInfo = {
  "launch": {
    "title": "Loading",
    "status": "waiting",
    "message": "",
  },
  "load": {
    "title": "ロード",
    "status": "waiting",
    "message": "",
  },
  "preprocess": {
    "title": "前処理",
    "status": "waiting",
    "message": "",
  },
  "solverStart": {
    "title": "並列ソルバ起動",
    "status": "waiting",
    "message": "",
  },
  "solve": {
    "title": "最適化",
    "status": "waiting",
    "message": "",
  },
  "solverEnd": {
    "title": "終了処理",
    "status": "waiting",
    "message": "",
  },
};

function updateMiddleOutputInfo(setMiddleOutputInfo, dmaxOutput, middleOutputInfo) {
  const lines = dmaxOutput.trim().split("\n");

  let launchMessage = "";
  let loadMessage = "";
  let presolveMessage = "";
  let solverStartMessage = "";
  let solveMessage = "";
  let solverEndMessage = "";

  let launchStatus = "waiting";
  let loadStatus = "waiting";
  let presolveStatus = "waiting";
  let solverStartStatus = "waiting";
  let solveStatus = "waiting";
  let solverEndStatus = "waiting";

  for (const line of lines) {
    if (line.startsWith("Nested Web Workers are supported"))
      launchMessage += "Nested WebWorker 有効\n";

    if (line.startsWith("webworker launched")) {
      launchMessage += "WebWorker 起動完了\n";
      launchStatus = "complete";
      loadStatus = "running";
    }

    if (line.startsWith("Nested Web Workers are not supported")) {
      launchMessage += "Nested WebWorker がサポートされていません\n";
      launchStatus = "error";
    }

    if (line.startsWith("Your browser does not support Web Workers")) {
      launchMessage += "WebWorker がサポートされていません\n";
      launchStatus = "error";
    }

    if (line.startsWith("original problem has ")) {
      // 正規表現を使って、数字以外の全ての文字を削除
      const variablesCount = line.slice(0, line.indexOf("variables")).replace(/\D/g, "");
      const constraintsCount = line
        .slice(line.indexOf(") and"), line.indexOf("costraints"))
        .replace(/\D/g, "");
      loadMessage = "元問題 変数: " + variablesCount + ", 制約式: " + constraintsCount;
      loadStatus = "complete";
    }

    // 前処理中の中間出力を更新
    // prettier-ignore
    if (line.startsWith('(round')) {
      const roundNumber = line.slice(line.indexOf('('), line.indexOf(')') + 1);
      const deletedVariables = line.slice(line.indexOf(')'), line.indexOf('del vars')).replace(/\D/g, '');
      const deletedConstraints = line.slice(line.indexOf('del vars'), line.indexOf('del conss')).replace(/\D/g, '');
      const addedConstraints = line.slice(line.indexOf('del conss'), line.indexOf('add conss')).replace(/\D/g, '');
      const changedBounds = line.slice(line.indexOf('add conss'), line.indexOf('chg bounds')).replace(/\D/g, '');
      const changedCoefficients = line.slice(line.indexOf('chg bounds'), line.indexOf('chg coeffs')).replace(/\D/g, '');
      const updatedConstraints = line.slice(line.indexOf('chg coeffs'), line.indexOf('upgd conss')).replace(/\D/g, '');
      presolveMessage = `${roundNumber}\n削除変数: ${deletedVariables}, 削除制約式: ${deletedConstraints}, 追加制約式: ${addedConstraints}, 範囲変更: ${changedBounds}, 係数変更: ${changedCoefficients}, 制約改善: ${updatedConstraints} \n`
      presolveStatus = "running";
    }

    // 前処理完了時の出力処理
    // prettier-ignore
    if (line.startsWith("presolved problem has")) {
      const variablesCount = line.slice(0, line.indexOf("variables")).replace(/\D/g, "");
      const constraintsCount = line.slice(line.indexOf(") and ")).replace(/\D/g, "");
      presolveMessage = `変数: ${variablesCount}, 制約式: ${constraintsCount}\n`;
    }

    if (line.startsWith("Presolving Time:")) {
      let presolvingTime = line.match(/\d+\.\d+/)[0];
      presolveMessage += `前処理時間: ${presolvingTime}秒\n`;
      // presolveComplete = true;
      presolveStatus = "complete";
      solverStartStatus = "running";
    }

    // 並列ソルバー起動処理の出力
    if (line.startsWith("starting solve in concurrent solver")) {
      const solverNumber = line.replace(/\D/g, "");
      solverStartMessage += `${solverNumber} `;
      solverStartStatus = "complete";

      setMiddleOutputInfo((prevMiddleOutputInfo) => {
        return {
          ...prevMiddleOutputInfo,
          "solverStart": {
            ...prevMiddleOutputInfo["solverStart"],
            "message": solverStartMessage,
            "status": "complete",
          },
          "solve": {
            ...prevMiddleOutputInfo["solve"],
            "status": "running",
          },
        };
      });
    }

    console.log("217: " + JSON.stringify(middleOutputInfo));

    // 並列ソルバーの中間出力
    if (line.match(/.*s\|.*M\|.*/)) {
      const variables = line.split("|");
      const time = variables[0].slice(0, variables[0].indexOf(".")).replace(/\D/g, "");
      const memory = variables[1] + "B";

      let dualbound = variables[2];
      if (dualbound.match(/.*\d/)) {
        dualbound = Math.round(parseFloat(dualbound) * 100) / 100;
      }

      let primalbound = variables[3];
      if (primalbound.match(/.*\d/)) {
        primalbound = Math.round(parseFloat(primalbound) * 100) / 100;
      }

      let gap = variables[4];
      gap = gap.slice(0, gap.indexOf("%") + 1);

      solveMessage = `${time}秒, 使用メモリ:${memory}, ダメージ上界: ${dualbound}, ダメージ下界: ${primalbound}, ギャップ: ${gap}`;
      solveStatus = "running";
      solverStartStatus = "complete";
    }

    // SCIP ソルバー実行終了後の状態
    if (line.startsWith("SCIP Status")) {
      let scipStatus, statusReason;
      if (line.includes("interrupted")) {
        scipStatus = "最適化中断";
      } else if (line.includes("solved")) {
        scipStatus = "最適化完了";
      } else {
        scipStatus = "未定義";
      }

      if (line.includes("user interrupt")) {
        statusReason = "ユーザーによる中断されました";
      } else if (line.includes("node limit reached")) {
        statusReason = "ノード限界に到達しました";
      } else if (line.includes("time limit reached")) {
        statusReason = "制限時間に到達しました";
      } else if (line.includes("memory limit reached")) {
        statusReason = "メモリ上限に到達しました";
      } else if (line.includes("gap limit reached")) {
        statusReason = "ギャップの限界に到達しました";
      } else if (line.includes("optimal solution found")) {
        statusReason = "最適解が見つかりました";
      } else if (line.includes("infeasible")) {
        statusReason = "装備が組めませんでした  条件を緩和してください";
      } else if (line.includes("unbounded")) {
        statusReason = "問題が非有界です";
      } else if (line.includes("iteration limit reached")) {
        statusReason = "反復回数の上限に到達しました";
      }

      solverEndMessage = `${scipStatus}: ${statusReason}\n`;
      solveStatus = "complete";
      solverEndStatus = "complete";
    }

    // 合計処理時間
    if (line.startsWith("Solving Time")) {
      const solvingTime = line.slice(line.indexOf(":"), line.indexOf("."));
      solverEndMessage += `合計処理時間 ${solvingTime}秒`;
    }

    setMiddleOutputInfo((prevMiddleOutputInfo) => {
      return {
        ...prevMiddleOutputInfo,
        "launch": {
          ...prevMiddleOutputInfo["launch"],
          "status": launchStatus,
          "message": launchMessage,
        },
        "load": {
          ...prevMiddleOutputInfo["load"],
          "status": loadStatus,
          "message": loadMessage,
        },
        "preprocess": {
          ...prevMiddleOutputInfo["preprocess"],
          "status": presolveStatus,
          "message": presolveMessage,
        },
        "solverStart": {
          ...prevMiddleOutputInfo["solverStart"],
          "status": solverStartStatus,
          "message": solverStartMessage,
        },
        "solve": {
          ...prevMiddleOutputInfo["solve"],
          "status": solveStatus,
          "message": solveMessage,
        },
        "solverEnd": {
          ...prevMiddleOutputInfo["solverEnd"],
          "status": solverEndStatus,
          "message": solverEndMessage,
        },
      };
    });
  }
}

export const DmaxOutput = ({ dmaxOutput, resetMiddleOutput, setResetMiddleOutput }) => {
  const initMiddleOutputInfo = JSON.parse(JSON.stringify(defaultMiddleOutputInfo));
  const [middleOutputInfo, setMiddleOutputInfo] = useState(initMiddleOutputInfo);

  useEffect(() => {
    updateMiddleOutputInfo(setMiddleOutputInfo, dmaxOutput, middleOutputInfo);
  }, [dmaxOutput]);

  useEffect(() => {
    if (resetMiddleOutput) {
      setMiddleOutputInfo(initMiddleOutputInfo);
      setResetMiddleOutput(false);
    }
  }, [resetMiddleOutput]);

  return (
    <Grid item xs={6}>
      <Card variant="outlined" sx={{ borderRadius: 1 }} backgroundColor="#f5f5f5">
        <Box
          style={{
            height: "450px",
            overflowY: "auto",
            padding: "8px",
            textAlign: "left",
          }}
        >
          <Box sx={{ margin: 1.5 }}>
            <MiddleOutput middleOutput={middleOutputInfo.launch} />
            <MiddleOutput middleOutput={middleOutputInfo.load} />
            <MiddleOutput middleOutput={middleOutputInfo.preprocess} />
            <MiddleOutput middleOutput={middleOutputInfo.solverStart} />
            <MiddleOutput middleOutput={middleOutputInfo.solve} />
            <MiddleOutput middleOutput={middleOutputInfo.solverEnd} />
          </Box>
        </Box>
      </Card>
    </Grid>
  );
};

export default DmaxOutput;
