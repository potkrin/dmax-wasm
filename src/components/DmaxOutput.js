import React, { useRef, useEffect } from "react";
import { Grid, Paper, Box, Card } from "@mui/material";

/**
ここに webworker や wasm の起動状況を表示する
起動完了, エラー, サポートされていないブラウザ など

[ロード]
    元問題 変数: 2200, 制約式: 241
[前処理中...]
    (round 10, exhaustive) 削除変数: 1365, 削除制約式: 183, 追加制約式: 993, 範囲変更: 2467, 係数変更: 1943, 制約改善: 51
[前処理完了]
    変数: 1622, 制約式: 1051
    前処理時間:  4秒
[並列ソルバ起動] 1 2 3
[最適化中...]
    18秒, 使用メモリ:  71MB, ダメージ上界: 170.57, ダメージ下界: 170.57, ギャップ:    0.00%
[最適化終了]
    最適化完了: 最適解が見つかりました
    合計処理時間 : 18秒
 */

export const DmaxOutput = ({ dmaxOutput }) => {
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [dmaxOutput]);

  return (
    <Grid item xs={6}>
      <Card variant="outlined" sx={{ borderRadius: 1 }} backgroundColor="#f5f5f5">
        <Box
          ref={boxRef}
          style={{
            height: "450px",
            overflowY: "auto",
            padding: "8px",
            textAlign: "left",
          }}
        >
          <pre>{dmaxOutput}</pre>
        </Box>
      </Card>
    </Grid>
  );
};

export default DmaxOutput;
