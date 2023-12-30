// ダークライト切り替えを実装しようとしたが断念 消しても良い
/**
  const sheetManager = multiKeyStore.get(stylesOptions.sheetsManager, stylesCreator, theme);
  sheetManager.refs -= 1;

  上記の部分で、
  makeStyles.js:133 Uncaught TypeError: Cannot read properties of undefined (reading 'refs')
  というエラーがでるが原因が分からなかったので断念
 */

// customStyles.js
// import { makeStyles } from "@mui/styles";
import React, { useContext } from "react";
import { LDThemeContext } from "./LDThemeContext";
import { theme } from "./ThemeProvider";

// const useCustomStyles = () => {
//   const { currentTheme } = React.useContext(LDThemeContext);

//   return makeStyles({
//     customHeader: {
//       padding: "0.25em 0.5em", // 上下 左右の余白
//       // color: "#494949", // 文字色
//       // background: "transparent", // 背景透明に
//       borderLeft: "solid 5px " + currentTheme.palette.primary.main, // 左線
//       fontWeight: "bold", // 太字
//       marginTop: "1em", // 上の余白
//       display: "inline-block", // インライン要素に
//       // borderBottom: "solid 1px #7db4e6", // 下線
//     },
//     customHeaderNoMargin: {
//       padding: "0.25em 0.5em", // 上下 左右の余白
//       // color: "#494949", // 文字色
//       // background: "transparent", // 背景透明に
//       borderLeft: "solid 5px " + currentTheme.palette.primary.main, // 左線
//       fontWeight: "bold", // 太字
//       display: "inline-block", // インライン要素に
//       // borderBottom: "solid 1px #7db4e6", // 下線
//     },
//     customHeaderThin: {
//       padding: "0.25em 0.5em", // 上下 左右の余白
//       // color: "#494949", // 文字色
//       // background: "transparent", // 背景透明に
//       borderLeft: "solid 3px " + currentTheme.palette.primary.main, // 左線
//       marginTop: "1em", // 上の余白
//       display: "inline-block", // インライン要素に
//       // borderBottom: "solid 1px #7db4e6", // 下線
//     },
//     customFontSize: {
//       fontSize: "10px !important",
//     },
//     inputCheckbox: {
//       fontSize: "14px !important",
//     },
//   });
// };

// export default useCustomStyles;
