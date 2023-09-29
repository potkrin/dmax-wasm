import logo from "./logo.svg";
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import {
  Container,
  Typography,
  Grid,
  Switch,
  Box,
  Slider,
  TextField,
  Button,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";

import Skill from "./components/Skill";
import NonDamageSkill from "./components/NonDamageSkill";
import { MonsterSetting } from "./components/MonsterSetting";
import { WeaponSetting } from "./components/WeaponSetting";
import { HunterSetting } from "./components/HunterSetting";
import { DangoSetting } from "./components/DangoSetting";
import { MelodySetting } from "./components/MelodySetting";
import { RampageDecoSetting } from "./components/RampageDecoSetting";

import { DmaxOutput } from "./components/DmaxOutput";
import { DmaxGraph } from "./components/DmaxGraph";

import { skillData } from "./data/SkillData";
import { UserInputData } from "./data/UserInputData";

/**
 * TODO:
 *   - スキルの検索ボックス。文字列がヒットしたもののみ残る
 *   - state 更新の軽量化
 */

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

// initSkillData: skillData の各オブジェクトに新しい key-value を追加したデータ構造
const initSkillData = Object.keys(skillData).reduce((acc, key) => {
  // // Slider が必要なスキル以外はスキップ
  // if (skillData[key].type === "NonDamage") {
  //   return acc;
  // }

  acc[key] = {
    ...skillData[key],
    activeRate: 100,
    fixLevel: false,
    minLevel: 0,
  };
  return acc;
}, {});

function App() {
  // 各スキルのデータを保持
  const [skillData, setSkillData] = useState(initSkillData);

  const updateSkillInfo = (key, value) => {
    setSkillData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // スキル以外のユーザ入力データを保持
  const [userInputData, setUserInputData] = useState(UserInputData);

  const updateUserInputData = (key, value) => {
    setUserInputData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // dmax からの中間出力データを管理
  const [dmaxOutput, setDmaxOutput] = useState("");
  const updateDmaxOutput = (newString) => {
    setDmaxOutput((prevString) => prevString + "\n" + newString);
  };

  // 常に最終行を表示
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [dmaxOutput]);

  // dmax 最適化の最終結果を管理
  const [dmaxResult, setDmaxResult] = useState("");
  const updateDmaxResult = (newString) => {
    updatePrevDmaxResult(dmaxResult);
    setDmaxResult(newString);
  };

  // 1つ前の dmax 最適化の最終結果を管理
  const [prevDmaxResult, setPrevDmaxResult] = useState("");
  const updatePrevDmaxResult = (newString) => {
    setPrevDmaxResult(newString);
  };

  // デバッグ用: 更新されるたびに表示
  useEffect(() => {
    console.log("useEffect userInputData:\n" + JSON.stringify(userInputData, null, 4));
  }, [skillData]);

  // デバッグ用: 更新されるたびに表示
  useEffect(() => {
    console.log("useEffect userInputData:\n" + JSON.stringify(userInputData, null, 4));
  }, [userInputData]);

  // recharts グラフ検証用データ
  let data = [];
  for (let i = 5; i < 100; i++) {
    if (100 - i === i) break;
    data.push({ time: i, uv: 100 - i, pv: i });
  }

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

  const eraseChartData = (newData) => {
    setChartData([]);
  };

  return (
    <div className="App">
      <Container sx={{ marginY: 5 }}>
        <Grid container spacing={1} marginY={1}>
          <MonsterSetting
            userInputDataMonster={userInputData["モンスター"]}
            updateUserInputData={updateUserInputData}
          />
        </Grid>
        <Grid container spacing={1} marginY={1}>
          <WeaponSetting
            userInputDataWeapon={userInputData["武器"]}
            updateUserInputData={updateUserInputData}
          />
        </Grid>
        <Grid container spacing={1} marginY={1}>
          <HunterSetting
            userInputDataHunter={userInputData["ハンター"]}
            updateUserInputData={updateUserInputData}
          />
        </Grid>
        <Grid container spacing={1} marginY={1}>
          <DangoSetting
            userInputDataDango={userInputData["食事"]}
            updateUserInputData={updateUserInputData}
          />
        </Grid>
        <Grid container spacing={1} marginY={1}>
          <MelodySetting
            userInputDataMelody={userInputData["旋律"]}
            updateUserInputData={updateUserInputData}
          />
        </Grid>
        <Grid container spacing={1} marginY={1}>
          <RampageDecoSetting
            userInputDataRampageDeco={userInputData["百竜装飾品"]}
            updateUserInputData={updateUserInputData}
          />
        </Grid>

        {/* スライダーありのスキル */}
        <Grid container marginTop={8}>
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "FixedLevelDamage")
            .map((key) => (
              <Skill
                skillInfo={skillData[key]}
                userInputData={userInputData}
                updateUserInputData={updateUserInputData}
              />
            ))}
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "Damage")
            .map((key) => (
              <Skill
                skillInfo={skillData[key]}
                userInputData={userInputData}
                updateUserInputData={updateUserInputData}
              />
            ))}
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "FreqNonDamage")
            .map((key) => (
              <Skill
                skillInfo={skillData[key]}
                userInputData={userInputData}
                updateUserInputData={updateUserInputData}
              />
            ))}
        </Grid>

        {/* スライダーなしのスキル 最大Lv5以上, Lv4, Lv3, ... */}
        <Grid container marginTop={2}>
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "NonDamage")
            .filter((key) => skillData[key].maxLevel > 4)
            .map((key) => (
              <NonDamageSkill skillInfo={skillData[key]} updateSkillInfo={updateSkillInfo} />
            ))}
        </Grid>
        <Grid container marginTop={2}>
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "NonDamage")
            .filter((key) => skillData[key].maxLevel === 4)
            .map((key) => (
              <NonDamageSkill skillInfo={skillData[key]} updateSkillInfo={updateSkillInfo} />
            ))}
        </Grid>
        <Grid container marginTop={2}>
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "NonDamage")
            .filter((key) => skillData[key].maxLevel === 3)
            .map((key) => (
              <NonDamageSkill skillInfo={skillData[key]} updateSkillInfo={updateSkillInfo} />
            ))}
        </Grid>
        <Grid container marginTop={2}>
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "NonDamage")
            .filter((key) => skillData[key].maxLevel === 2)
            .map((key) => (
              <NonDamageSkill skillInfo={skillData[key]} updateSkillInfo={updateSkillInfo} />
            ))}
        </Grid>
        <Grid container marginTop={2}>
          {Object.keys(skillData)
            .filter((key) => skillData[key].type === "NonDamage")
            .filter((key) => skillData[key].maxLevel === 1)
            .map((key) => (
              <NonDamageSkill skillInfo={skillData[key]} updateSkillInfo={updateSkillInfo} />
            ))}
        </Grid>
        <Grid container marginTop={2}>
          <Grid item xs={2}>
            <Button
              onClick={() => {
                call_worker_wasm_main({});
                // デバッグ用
                console.log(
                  "デバッグ出力: userInputData = \n" + JSON.stringify(userInputData, null, 4)
                );
                updateDmaxOutput(
                  "デバッグ出力: userInputData = \n" + JSON.stringify(userInputData, null, 4)
                );
              }}
            >
              Output
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={() => {
                // デバッグ用
                updateDmaxResult("ここに結果を出力します。");
                const apiUrl = "http://127.0.0.1:8000/en/cms/dmaxapi/"; // en/ja を含めないとリダイレクトレスポンスがCORSポリシーで弾かれる

                fetch(apiUrl)
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                  })
                  .then((data) => {
                    console.log(data);
                    updateDmaxResult(JSON.stringify(data, null, 4));
                  })
                  .catch((error) => {
                    console.log(`Fetching from ${apiUrl} failed: ${error.message}`);
                    updateDmaxResult(`Fetching from ${apiUrl} failed: ${error.message}`);
                  });
              }}
            >
              call GET API
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={() => {
                // デバッグ用
                updateDmaxResult("ここに結果を出力します。");
                const apiUrl = "http://127.0.0.1:8000/en/cms/dmaxapi/"; // en/ja を含めないとリダイレクトレスポンスがCORSポリシーで弾かれる

                const postBody = {
                  message: "hello from React!",
                };

                fetch(apiUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(userInputData),
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                  })
                  .then((data) => {
                    console.log(data);
                    updateDmaxResult(JSON.stringify(data, null, 4));
                    eraseChartData();
                    call_worker_wasm_main(data, updateDmaxOutput, updateChartData);
                    console.log("chartData = \n" + chartData);
                  })
                  .catch((error) => {
                    console.log(`Fetching from ${apiUrl} failed: ${error.message}`);
                    updateDmaxResult(`Fetching from ${apiUrl} failed: ${error.message}`);
                  });
              }}
            >
              call POST API
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={1} marginY={1}>
          <DmaxOutput dmaxOutput={dmaxOutput} />
          <DmaxGraph chartData={chartData} />
        </Grid>
        <Grid container spacing={1} marginY={1}>
          <Grid item xs={6}>
            <Paper elevation={2}>
              <Box
                ref={boxRef}
                style={{
                  height: "450px",
                  overflowY: "auto",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                <pre>{dmaxResult}</pre>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={2}>
              <Box
                style={{
                  height: "450px",
                  overflowY: "auto",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                <pre>{prevDmaxResult}</pre>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
