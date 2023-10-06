/* Dmax API呼び出し, wasm-dmax-solver の呼び出し, 出力表示を行うコンポーネント*/

import { React, useState, useRef, useEffect } from "react";
import { Grid, Button } from "@mui/material";

import { DmaxOutput } from "./DmaxOutput";
import { DmaxGraph } from "./DmaxGraph";
import { DmaxResult } from "./DmaxResult";
import { armors, decos } from "../data/EquipData";
import { staticData } from "../data/StaticData";

// dmax-core を呼び出すための処理
let startWasmWorker;

function supportsNestedWebWorkers() {
  console.log("supportsNestedWebWorkers() called");
  try {
    var blob = new Blob(
      [
        "var worker = new Worker(URL.createObjectURL(new Blob(['self.postMessage(1);'], {type: 'text/javascript'}))); worker.onmessage = function(e) { self.postMessage(e.data); }",
      ],
      { type: "text/javascript" }
    );

    var url = URL.createObjectURL(blob);
    var worker = new Worker(url);

    worker.onmessage = function (e) {
      worker.terminate();
      URL.revokeObjectURL(url);
      if (e.data === 1) {
        console.log("Nested Web Workers are supported");
      } else {
        console.log("Nested Web Workers are not supported");
      }
    };

    worker.onerror = function () {
      worker.terminate();
      URL.revokeObjectURL(url);
      console.log("Nested Web Workers are not supported");
    };
  } catch (e) {
    console.log("Nested Web Workers are not supported");
  }
}

function call_worker_wasm_main(problem_data, updateDmaxOutput, updateChartData) {
  supportsNestedWebWorkers();

  // gonextbench = false;
  if (window.Worker) {
    console.log("webworker enable");

    if (startWasmWorker) {
      startWasmWorker.terminate();
    }
    startWasmWorker = new Worker(process.env.PUBLIC_URL + "/dmax-core/worker3.js", {
      name: "startWasmWorker",
    });

    startWasmWorker.postMessage(["file.nl", 4, 3072, problem_data]);
    console.log("Message posted to worker");

    startWasmWorker.onmessage = function (e) {
      let worker_response = e.data;
      //console.log("message received from worker: " + worker_response);
      // console.log(worker_response);
      updateDmaxOutput(worker_response);

      const lines = worker_response.trim().split("\n");

      for (const line of lines) {
        if (line.includes("s|")) {
          const [time, usedMemory, upperLimit, lowerLimit, gap] = line
            .split("|")
            .map((item) => item.trim());
          console.log({
            time: parseFloat(time.replace("$", "").replace("s", "")),
            usedMemory: usedMemory.replace("M", ""),
            upperLimit: parseFloat(upperLimit),
            lowerLimit: parseFloat(lowerLimit),
            gap: parseFloat(gap),
          });
          updateChartData({
            time: parseFloat(time.replace("$", "").replace("s", "")),
            usedMemory: parseInt(usedMemory.replace("M", "")),
            upperLimit: parseFloat(upperLimit),
            lowerLimit: parseFloat(lowerLimit),
          });
        }
      }

      // output.value += worker_response + "\n";
      // output.scrollTop = output.scrollHeight;
      // getBenchmarkData(worker_response);
      // console.log("benchmarkdData = ");
      // console.log(benchmarkdData);
    };
  } else {
    console.log("Your browser doesn't support web workers.");
  }
}

// dmax-core を呼び出すための処理 ここまで

export const DmaxSolver = ({ userInputData }) => {
  // dmax からの中間出力データを管理
  const [dmaxOutput, setDmaxOutput] = useState("");
  const updateDmaxOutput = (newString) => {
    setDmaxOutput((prevString) => prevString + "\n" + newString);
  };

  const eraseDmaxOutput = (newString) => {
    setDmaxOutput("");
  };

  // 常に最終行を表示
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [dmaxOutput]);

  // dmax 最適化の最終結果を管理
  const [middleOutput, setMiddleOutput] = useState("");
  const updateMiddleOutput = (newString) => {
    setMiddleOutput(newString);
  };

  useEffect(() => {
    // dmax 最適化が完了したら middleOutput に全ての中間結果を渡す (出力生計は middleOutput コンポーネントで行う)
    if (dmaxOutput.includes("SCIP Status")) {
      updateMiddleOutput(dmaxOutput);
    }
  }, [dmaxOutput]);

  // 1つ前の dmax 最適化の最終結果を管理
  const [prevMiddleOutput, setPrevMiddleOutput] = useState("");
  const updatePrevMiddleOutput = (newString) => {
    setPrevMiddleOutput(newString);
  };

  // dmax からの中間出力データを管理
  const [chartData, setChartData] = useState([]);
  const updateChartData = (newData) => {
    setChartData((prevData) => {
      console.log(
        "prevData = " + JSON.stringify(prevData) + " newData = " + JSON.stringify(newData)
      );
      return [...prevData, newData];
    });
  };

  const eraseChartData = () => {
    setChartData([]);
  };

  // 最適化ボタンを押した時点の入力データを保存する変数
  const [processingUserInputData, setProcessingUserInputData] = useState({});
  const updateProcessingUserInputData = (newData) => {
    setProcessingUserInputData(newData);
  };

  // 最適化ボタンを押した時点の入力データを保存する変数
  const [processingUserArmorsData, setProcessingUserArmorsData] = useState([]);
  const updateProcessingUserArmorsData = (newData) => {
    setProcessingUserArmorsData(newData);
  };

  useEffect(() => {
    console.log("processingUserArmorsData = " + JSON.stringify(processingUserArmorsData, null, 4));
  }, [processingUserArmorsData]);

  return (
    <>
      <Grid container marginTop={2}>
        <Grid item xs={2}>
          <Button
            onClick={() => {
              const apiUrl = "http://127.0.0.1:8000/en/cms/dmaxapi/"; // en/ja を含めないとリダイレクトレスポンスがCORSポリシーで弾かれる

              // ユーザが入力した護石データを防具データ一覧 (userArmors) に追加
              let userArmors = JSON.parse(JSON.stringify(armors));
              let userCharmString = localStorage.getItem("userCharmData");
              if (userCharmString) {
                let userCharmData = JSON.parse(userCharmString);
                console.log("userCharmData = " + JSON.stringify(userCharmData, null, 4));
                for (let charm of userCharmData) {
                  console.log("charm = " + JSON.stringify(charm, null, 4));
                  let tempCharm = {
                    "rare": 0,
                    "type": "charm",
                    // 護石【攻撃2, 連撃2】4-1-1 形式で名前を作成
                    "name":
                      "護石【" +
                      charm["1stSkill"]["name"] +
                      charm["1stSkill"]["level"] +
                      "，" +
                      charm["2ndSkill"]["name"] +
                      charm["2ndSkill"]["level"] +
                      "】" +
                      charm["slots"][0] +
                      "-" +
                      charm["slots"][1] +
                      "-" +
                      charm["slots"][2],
                    "deffence": 0,
                    "fire": "0",
                    "water": "0",
                    "ice": "0",
                    "thunder": "0",
                    "dragon": "0",
                    "slots": [charm["slots"][0], charm["slots"][1], charm["slots"][2]],
                    "skills": {
                      [charm["1stSkill"]["name"]]: charm["1stSkill"]["level"],
                      [charm["2ndSkill"]["name"]]: charm["2ndSkill"]["level"],
                    },
                  };

                  userArmors.push(tempCharm);
                }
              }

              // ユーザの傀異錬成防具を全防具データに追加
              let userQuriousArmor = JSON.parse(localStorage.getItem("userQuriousArmorData"));
              userArmors.push(...userQuriousArmor);

              fetch(apiUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  "userInputData": userInputData,
                  "armors": userArmors,
                  "decos": decos,
                  "staticData": staticData,
                }),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
                })
                .then((data) => {
                  // 前回の最終結果用データを隣に移動
                  updatePrevMiddleOutput(middleOutput);
                  updateMiddleOutput("");

                  // 前回の中間出力データを消去
                  eraseDmaxOutput();
                  eraseChartData();
                  call_worker_wasm_main(data, updateDmaxOutput, updateChartData);
                })
                .catch((error) => {
                  console.log(`Fetching from ${apiUrl} failed: ${error.message}`);
                  updateMiddleOutput(`Fetching from ${apiUrl} failed: ${error.message}`);
                });

              // ボタンを押した時点の入力データを保存する
              // = 代入や Object.assign() では浅いコピーしか行われないので JSON を経由して深いコピーを行う
              // 同期処理のためデータが大きい場合、メインスレッドがハングする可能性がある
              updateProcessingUserInputData(JSON.parse(JSON.stringify(userInputData)));
              updateProcessingUserArmorsData(JSON.parse(JSON.stringify(userArmors)));
            }}
          >
            Optimize
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            onClick={() => {
              if (startWasmWorker) {
                startWasmWorker.terminate();
              }
            }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={1} marginY={1}>
        <DmaxOutput dmaxOutput={dmaxOutput} />
        <DmaxGraph chartData={chartData} />
      </Grid>
      <Grid container spacing={1} marginY={1}>
        <DmaxResult
          middleOutput={middleOutput}
          processingUserInputData={processingUserInputData}
          processingUserArmorsData={processingUserArmorsData}
        />
        <DmaxResult
          middleOutput={prevMiddleOutput}
          processingUserInputData={processingUserInputData}
          processingUserArmorsData={processingUserArmorsData}
        />
      </Grid>
    </>
  );
};

export default DmaxSolver;
