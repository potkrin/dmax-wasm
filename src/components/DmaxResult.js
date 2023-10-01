import React, { useRef, useEffect } from "react";
import { Grid, Paper, Box } from "@mui/material";

import { armors, decos } from "../data/EquipData";
import { staticSkillData } from "../data/StaticData";

// 秒を読みやすい形式に変換
function secondsToHumanReadable(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const daysSeconds = days * 24 * 60 * 60;
  seconds = seconds > daysSeconds ? seconds - daysSeconds : seconds;

  const hours = Math.floor(seconds / (60 * 60));
  const hoursSeconds = hours * 60 * 60;
  seconds = seconds > hoursSeconds ? seconds - hoursSeconds : seconds;

  const minutes = Math.floor(seconds / 60);
  const minutesSeconds = minutes * 60;
  seconds = seconds > minutesSeconds ? seconds - minutesSeconds : seconds;

  let result = "";
  if (days > 0) result += days + "日 ";
  if (hours > 0 || days > 0) result += hours + "時間 ";
  if (minutes > 0 || hours > 0 || days > 0) result += minutes + "分 ";
  result += seconds + "秒";

  return result.trim();
}

// 全ての中間結果を含む文字列を処理し、最終結果を出力する
function outputToResult(output) {
  let result = "";
  if (output.includes("SCIP Status")) {
    let lines = output.split("\n");

    let list_q_result = [];
    let dict_other_result = {};

    lines.forEach((line) => {
      if (line.startsWith("SCIP Status")) {
        let scip_status = "";
        let status_reason = "";

        if (line.includes("interrupted")) {
          scip_status = "最適化中断";
        } else if (line.includes("solved")) {
          scip_status = "最適化完了";
        } else {
          scip_status = "未定義";
        }

        if (line.includes("user interrupt")) {
          status_reason = "ユーザーによる中断されました";
        } else if (line.includes("node limit reached")) {
          status_reason = "ノード限界に到達しました";
        } else if (line.includes("time limit reached")) {
          status_reason = "制限時間に到達しました";
        } else if (line.includes("memory limit reached")) {
          status_reason = "メモリ上限に到達しました";
        } else if (line.includes("gap limit reached")) {
          status_reason = "ギャップの限界に到達しました";
        } else if (line.includes("optimal solution found")) {
          status_reason = "最適解が見つかりました";
        } else if (line.includes("infeasible")) {
          status_reason = "装備が組めませんでした  条件を緩和してください";
        } else if (line.includes("unbounded")) {
          status_reason = "問題が非有界です";
        } else if (line.includes("iteration limit reached")) {
          status_reason = "反復回数の上限に到達しました";
        }

        result = `[最適化終了]\n${scip_status}: ${status_reason}\n`;
      }

      if (line.startsWith("Solving Time")) {
        let solving_time = line.substring(line.indexOf(":") + 1, line.indexOf("."));
        solving_time = secondsToHumanReadable(parseInt(solving_time));
        result += `合計処理時間: ${solving_time}\n\n\n`;
      }

      // 最終結果の出力を処理
      // q[ で開始される行 = 最大ダメージを実現する 装備の名称と個数
      if (line.startsWith("q[")) {
        list_q_result.push(line);
      }

      // 最大ダメージ
      if (line.startsWith("objective value:")) {
        let max_damage_result = line.slice(line.indexOf(":") + 1, line.indexOf("("));
        dict_other_result["最大ダメージ"] = parseFloat(max_damage_result).toFixed(3).toString();
      }

      // 疾替えの書
      if (line.startsWith("ss[")) {
        let swap_scroll_result = line.slice(3, line.indexOf("]"));
        dict_other_result["疾替えの書"] = swap_scroll_result;
      }

      // 百竜装飾品
      if (line.startsWith("rd[")) {
        let rampage_deco_result = line.slice(3, line.indexOf("]"));
        dict_other_result["百竜装飾品"] = rampage_deco_result;
      }

      // 会心率
      if (line.startsWith("afr")) {
        let affinity_rate_result = parseFloat(line.slice(3, line.indexOf("(")));
        dict_other_result["会心率"] = affinity_rate_result.toString() + "%";
      }
    });

    // 全装備データ(防具･護石･装飾品) を名前で引ける辞書を作成
    let dictEquipAll = {};

    for (let eq of armors) {
      dictEquipAll[eq.name] = eq;
    }

    for (let deco of decos) {
      dictEquipAll[deco.name] = deco;
    }

    // 出力結果の装備(防具･護石･装飾品)とその数を保持する辞書
    let dictResultEquipment = {};

    // 防具や装飾品の数が反映できていない
    for (let q of list_q_result) {
      let qEquipName = q.slice(2, q.indexOf("]"));
      qEquipName = qEquipName.replace(/'/g, "");
      let qEquipCount = q.slice(q.indexOf("]") + 1, q.indexOf("("));
      qEquipCount = Math.round(parseFloat(qEquipCount));

      // 数が0 の装備は除外
      if (qEquipCount === 0) {
        console.log("!! count == 0 found. skip !!");
        continue;
      }

      // 名前が見つからない装備は除外
      let qEquipInfo = {};
      if (!(qEquipName in dictEquipAll)) {
        console.log("!! armor NOT found. skip !!");
        continue;
      } else {
        qEquipInfo = dictEquipAll[qEquipName];
      }

      let slotLevel = qEquipInfo.type === "deco" ? qEquipInfo.size : -1;

      dictResultEquipment[qEquipName] = {
        count: Math.round(parseFloat(qEquipCount)),
        eqDict: qEquipInfo,
        decoSlotLevel: slotLevel,
      };
    }

    // 最大ダメージ, 疾替えの書, 百竜装飾品, 会心率などの出力
    for (const key in dict_other_result) {
      result += key + ": " + dict_other_result[key] + "\n";
    }

    // 部位の出力
    result += "\n[装備構成]\n";
    const eqtypeDict = {
      weapon: "武器スロット",
      head: "頭",
      torso: "胴",
      arms: "腕",
      waist: "腰",
      legs: "脚",
      charm: "護石",
    };
    for (const eqtype in eqtypeDict) {
      if (eqtype === "weapon") {
        result += eqtypeDict[eqtype] + "\n"; // 一時的に除外 //": " + weaponSlot.slots + "\n";
        continue;
      }

      for (const req in dictResultEquipment) {
        if (eqtype === dictResultEquipment[req].eqDict.type) {
          result += eqtypeDict[eqtype] + ": " + req + "\n";
        }
      }
    }

    result += "\n[装飾品]\n";
    // 装飾品の出力 (スロレベル順)
    const slotLevels = [4, 3, 2, 1];
    for (const level of slotLevels) {
      for (const req in dictResultEquipment) {
        if (dictResultEquipment[req].deco_slotlevel === -1) {
          continue;
        }

        if (level === dictResultEquipment[req].decoSlotLevel) {
          result += req + ": " + dictResultEquipment[req].count + "\n";
        }
      }
    }

    // 出力結果の装備構成で発動するスキルとそのレベルを保持するオブジェクト
    const dictResultSkill = {};

    // 出力結果の装備オブジェクトから発動スキルとそのレベルを取り出す
    for (const req in dictResultEquipment) {
      console.log("req =", req);
      if (dictResultEquipment[req].count === 0) {
        continue;
      }

      for (const skill in dictEquipAll[req].skills) {
        if (skill in dictResultSkill) {
          dictResultSkill[skill] +=
            dictEquipAll[req].skills[skill] * dictResultEquipment[req].count;
        } else {
          dictResultSkill[skill] = dictEquipAll[req].skills[skill] * dictResultEquipment[req].count;
        }
      }
    }

    // 最大レベルを超えているスキルのレベルを修正
    for (const skill in dictResultSkill) {
      dictResultSkill[skill] = Math.min(staticSkillData[skill]["maxLevel"], dictResultSkill[skill]);
    }

    console.log("result skills:");
    result += "\n[スキル構成]\n";

    console.log(dictResultSkill);
    const skillLevels = Array.from({ length: 7 }, (_, i) => i + 1).reverse();

    for (const level of skillLevels) {
      for (const req in dictResultSkill) {
        if (level === dictResultSkill[req]) {
          result += req + ": " + dictResultSkill[req] + "\n";
        }
      }
    }
  } else if (result === "") {
    result = "";
  } else {
    result = "Unknow Error: 'SCIP Status' not found in dmax output.";
  }
  return result;
}

export const DmaxResult = ({ middleOutput }) => {
  const dmaxResult = outputToResult(middleOutput);

  return (
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
          <pre>{dmaxResult}</pre>
        </Box>
      </Paper>
    </Grid>
  );
};

export default DmaxResult;
