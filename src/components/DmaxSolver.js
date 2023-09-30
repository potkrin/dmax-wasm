/* Dmax API呼び出し, wasm-dmax-solver の呼び出し, 出力表示を行うコンポーネント*/

import { React, useState, useRef, useEffect } from "react";
import { Grid, Paper, Box, Button } from "@mui/material";

import { DmaxOutput } from "./DmaxOutput";
import { DmaxGraph } from "./DmaxGraph";

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
    <>
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
    </>
  );
};

export default DmaxSolver;
