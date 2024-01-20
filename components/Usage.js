import React from "react";
import { styled } from "@mui/system";
import { Box, Card, CardMedia, Dialog, List, ListItem, Paper, Typography } from "@mui/material";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { LDThemeContext } from "./LDThemeContext";
import { theme } from "./ThemeProvider";
import Image from "next/image";
import skillLevelPcDark from "../public/images/dmax-usage-skill-level-pc-dark.png";
import skillLevelPcLight from "../public/images/dmax-usage-skill-level-pc-light.png";

const CustomH1 = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  paddingTop: "2.0em",
  fontWeight: "bold",
}));

const CustomH2 = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  paddingTop: "2.5em",
  fontWeight: "bold",
  // 他のスタイル規則もここに追加できます
}));

function Usage() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { currentTheme } = React.useContext(LDThemeContext);

  return (
    <Paper>
      <Box sx={{ maxWidth: "800px", padding: 3 }}>
        <CustomH1 variant="h1" gutterBottom sx={{ paddingTop: "0em" }} theme={currentTheme}>
          DMAX: 自動ダメージ最大化シミュレーター
        </CustomH1>
        <Typography variant="body1" gutterBottom>
          DMAXは「モンスターハンターライズ：サンブレイク」の自動ダメージ最大化シミュレーターです。
        </Typography>
        <Typography variant="body1" gutterBottom>
          モンスターの肉質・武器種・必須スキル等を指定すると、指定した条件の中で最大ダメージを実現する装備構成を自動で見つけてくれます。
        </Typography>
        <Card
          sx={{
            maxWidth: 500, // 最大幅
            boxShadow: 0, // シャドウの強度（0から24までの値）
            borderRadius: 2, // ボーダーの角丸み
            backgroundColor: currentTheme.palette.background.default,
            marginY: 2,
          }}
        >
          <Table sx={{ width: "100%" }} size="small" aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  対応武器種
                </TableCell>
                <TableCell align="left">弓</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  動作環境
                </TableCell>
                <TableCell align="left">PCブラウザ（モバイルは現在非対応）</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        <CustomH1 variant="h1" gutterBottom>
          使い方
        </CustomH1>

        <CustomH2
          variant="h2"
          gutterBottom
          sx={{
            paddingTop: "0em",
          }}
        >
          1. 前提条件を入力
        </CustomH2>
        <Typography variant="body1" gutterBottom>
          最大ダメージ構成を求める上で前提条件として以下の項目を入力します。こちらは最大ダメージ構成を求める上で固定される値となります。
        </Typography>
        <Typography variant="body1" gutterBottom>
          「疾替えの書」と「百竜装飾品」は複数選択することができます。
        </Typography>
        <ul>
          <li>モンスター</li>
          <li>武器</li>
          <li>ハンター</li>
          <li>食事</li>
          <li>旋律</li>
          <li>百竜装飾品</li>
        </ul>
        <CustomH2 variant="h2" gutterBottom>
          2. スキルの下限レベルを入力
        </CustomH2>
        <Typography variant="body1" gutterBottom>
          スキルの項目では各スキルが最低限満たしてほしいレベルを入力します。
          <span style={{ color: theme.palette.secondary.main }}>
            どうしても必要なスキル以外は全てLv0を指定してください。
          </span>
        </Typography>
        <Typography variant="body1" gutterBottom>
          下限レベルを可能な限り低く設定することによってより広い範囲から最大ダメージ構成を求めることが出来るので、より高いダメージの構成が見つかる可能性が上がります。
        </Typography>
        <Box
          sx={{
            boxShadow:
              "0 4px 8px 0 " +
              (currentTheme.palette.mode === "dark"
                ? currentTheme.palette.background.default
                : currentTheme.palette.text.hint), // ここで影のスタイルを指定
            borderRadius: 2, // 角丸の指定
            overflow: "hidden", // Box内のコンテンツが角丸に合わせて切り取られるように設定
            maxWidth: "600px",
            margin: "1em",
          }}
        >
          <Image
            src={currentTheme.palette.mode === "dark" ? skillLevelPcDark : skillLevelPcLight}
            alt="Your Image Description"
            // width={100}
            // height={300}
            layout="responsive"
            // style={{ width: "auto", height: "auto" }}
          />
        </Box>
        <Typography
          variant="body1"
          gutterBottom
          sx={{ color: currentTheme.palette.text.secondary }}
        >
          例えば、「火事場運用のために『伏魔響命』が最低Lv1は欲しいが、ほかのスキル構成は何でも良い」という場合、伏魔響命のみLv1を入力し、その他のスキルはすべてLv0を入力します。
          すると最適化結果は「伏魔響命Lv1」を満たす構成のなかで最大ダメージとなる構成になります。
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          sx={{ color: currentTheme.palette.text.secondary }}
        >
          例外として、スキル「闇討ち」と「弾・矢強化」は固定レベルしか選択できません。Lv2を指定した場合は必ずLv2となり、Lv3やLv1になることはありません。
          こちらは、最適化処理をできるだけ軽くするために固定レベルしか選択できないようにしています。
          ("特殊な運用が必要" or "Lv3がほぼ必須" のため問題になることは少ないと思います)
        </Typography>
        <CustomH2 variant="h2" gutterBottom>
          3. レベルを固定したいスキルを入力
        </CustomH2>
        <Typography variant="body1" gutterBottom>
          <span style={{ color: theme.palette.secondary.main }}>
            レベルを固定したいスキルはチェックボックスをON
          </span>
          にしてください。
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          sx={{ color: currentTheme.palette.text.secondary }}
        >
          DMAXのレベル選択は基本的に下限を指定しますが、レベルを固定したくなるスキルもあります。
          例えば、火事場を運用を想定して最適化した結果「狂竜症【蝕】」がLv1以上になってしまった場合、スキル効果によって回復されてしまい火事場運用ができません。
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          sx={{ color: currentTheme.palette.text.secondary }}
        >
          このような場合は、「狂竜症【蝕】」のレベル固定チェックボックスをONにした上でLv0を選択してください。
          すると「狂竜症【蝕】Lv0」のなかで最大ダメージとなる構成を探してくれるので、火事場運用可能な構成が出力されます。
        </Typography>

        <CustomH2 variant="h2" gutterBottom>
          4. ダメージ寄与スキルのスキル発動率を入力
        </CustomH2>
        <Typography variant="body1" gutterBottom>
          ダメージ計算式に寄与するスキルのうち、
          <span style={{ color: theme.palette.secondary.main }}>
            常時発動でないスキルについてはスキル発動率を設定してください。
          </span>
          スキル発動率は、クエスト中にスキルが発動している割合を想定して入力してください。
        </Typography>

        <Typography
          variant="body1"
          gutterBottom
          sx={{ color: currentTheme.palette.text.secondary }}
        >
          例えば、モンスターの怒り時のみ効果が発動する「挑戦者」の場合、攻撃時間に占める怒り状態の割合を想定してスキル発動率を入力します。
          するとダメージ計算式における「挑戦者」の効果を発動率をもとに期待値として計算してくれます。
        </Typography>

        <Card
          sx={{
            // maxWidth: 345, // 最大幅
            boxShadow: 3, // シャドウの強度（0から24までの値）
            borderRadius: 2, // ボーダーの角丸み
          }}
          onClick={handleClickOpen}
        >
          <CardMedia
            component="img"
            // height="140"
            image="/images/dmax-sample.png"
            alt="Your Image Description"
          />
        </Card>
        <Dialog open={open} onClose={handleClose}>
          <img
            src="/images/dmax-sample.png"
            alt="Your Image Description"
            style={{ width: "auto", height: "auto" }}
          />
        </Dialog>
      </Box>
    </Paper>
  );
}

export default Usage;
