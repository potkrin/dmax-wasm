//   Module["print"] = (function () {
//     var element = document.getElementById("output");
//     if (element) element.value = ""; // clear browser cache
//     return function (text) {
//       if (arguments.length > 1)
//         text = Array.prototype.slice.call(arguments).join(" ");
//       // These replacements are necessary if you render to raw HTML
//       //text = text.replace(/&/g, "&amp;");
//       //text = text.replace(/</g, "&lt;");
//       //text = text.replace(/>/g, "&gt;");
//       //text = text.replace('\n', '<br>', 'g');
//       console.log(text);
//       if (element) {
//         element.value += text + "\n";
//         element.scrollTop = element.scrollHeight; // focus on bottom
//       }
//     };
//   })();

//   /* to set Module["print"] to out, redifine here
//    * out is related with stdout on C/C++
//    */
//   out = Module["print"] || defaultPrint;

//   let js_wrapped_main = Module.cwrap("main", "number");
//   let js_wrapped_wasm_main = Module.cwrap("wasm_main", "number", [
//     "string",
//     "number",
//   ]);

//   function call_wasm_main() {
//     let arg_threadnum = document.getElementById("threadnum").value;
//     let arg_problem = document.getElementById("problem-select").value;
//     console.log("problem: " + arg_problem);
//     console.log("number of threads: " + arg_threadnum);
//     console.log(
//       "The result wasm_main() is: ",
//       js_wrapped_wasm_main(arg_problem, arg_threadnum)
//     );
//   }

// const problem = document.querySelector("#problem-select");
// const threadnum = document.querySelector("#threadnum");
// const minthreadnum = document.querySelector("#minthreadnum");
// const maxthreadnum = document.querySelector("#maxthreadnum");
// const memorylimit = document.querySelector("#memorylimit");

// let gonextbench = true;

// const output = document.querySelector("#output");
// const output_bench = document.querySelector("#benchmarkdata");

// let problem_list = [
//   // "dmax_problem_light.nl",
//   // "dmax_problem_middle.nl",
//   // "dmax_problem_hard.nl",
//   "dmax_problem_veryhard.nl",
//   // "dmax_problem.nl",
// ];
// let benchmarkdData = {};
// let current_thread_num;
// let current_problem_name;

// function getBenchmarkData(text) {
//   console.log("getBenchmarkData() text= " + text);
//   if (text.indexOf("problem:") != -1) {
//     // 問題ファイル名読み取り
//     console.log("getBenchmarkData() found problem");
//     for (let elem of problem_list) {
//       if (text.indexOf(elem) != -1) {
//         if (!(elem in benchmarkdData)) benchmarkdData[elem] = {};
//         current_problem_name = elem;
//       }
//     }
//     // problem_list.forEach(function (elem, index) {
//     //     if (text.indexOf(elem) != -1) {
//     //         if (!elem in benchmarkdData)
//     //             benchmarkdData[elem] = {};
//     //         current_problem_name = elem;
//     //     }
//     // });

//     // スレッド数読み取り
//     const regex = /[^0-9]/g;
//     current_thread_num = parseInt(text.replace(regex, ""));
//   }

//   if (text.indexOf("Solving Time (sec)") != -1) {
//     console.log("getBenchmarkData() found solving time");
//     const regex = /[^0-9.]/g;
//     solving_time = parseFloat(text.replace(regex, ""));
//     benchmarkdData[current_problem_name][current_thread_num] = solving_time;
//   }

//   if (worker_response.indexOf("nlobjvar") != -1) {
//     gonextbench = true;
//   }
// }

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

function call_worker_wasm_main() {
  supportsNestedWebWorkers();

  gonextbench = false;
  if (window.Worker) {
    console.log("webworker enable");

    if (startWasmWorker) {
      startWasmWorker.terminate();
    }
    startWasmWorker = new Worker("worker3.js", {
      name: "startWasmWorker",
    });

    startWasmWorker.postMessage([problem.value, threadnum.value, memorylimit.value]);
    console.log("Message posted to worker");

    startWasmWorker.onmessage = function (e) {
      worker_response = e.data;
      console.log("message received from worker: " + worker_response);
      // output.value += worker_response + "\n";
      // output.scrollTop = output.scrollHeight;
      // getBenchmarkData(worker_response);
      console.log("benchmarkdData = ");
      console.log(benchmarkdData);
    };
  } else {
    console.log("Your browser doesn't support web workers.");
  }
}

// function call_worker_main() {
//   if (window.Worker) {
//     console.log("webworker enable");
//     const myWorker = new Worker("worker3_main.js", {
//       name: "mainWorker",
//     });

//     myWorker.postMessage(["Hello Worker!"]);
//     console.log("Message posted to worker");

//     myWorker.onmessage = function (e) {
//       worker_response = e.data;
//       console.log("message received from worker: " + worker_response);
//     };
//   } else {
//     console.log("Your browser doesn't support web workers.");
//   }
// }

const sleep = (callback, delay = 1000) => {
  return new Promise((resolve) => {
    return setTimeout(() => {
      callback();
      return resolve();
    }, delay);
  });
};

async function run_benchmark() {
  let min_thread = minthreadnum.value;
  let max_thread = maxthreadnum.value;
  let memory_limit = memorylimit.value;

  for (const current_problem of problem_list) {
    for (let current_threadnum = min_thread; current_threadnum <= max_thread; current_threadnum++) {
      while (!gonextbench) {
        await sleep(() => {
          console.log("gonextbench = ", gonextbench);
        });
      }

      // setTimeout(() => {
      //     console.log("Delayed for 2 second.");
      // }, "2000");

      console.log(
        "run benchmark: " +
          current_problem +
          ", threadnum: " +
          current_threadnum +
          ", memorylimit: " +
          memory_limit
      );

      threadnum.value = current_threadnum;
      problem.value = current_problem;

      call_worker_wasm_main();
      // while (!gonextbench) {}
      console.log("benchmarkdData = ");
      console.log(benchmarkdData);
      output_bench.value = JSON.stringify(benchmarkdData, null, 4);
    }
  }
}
