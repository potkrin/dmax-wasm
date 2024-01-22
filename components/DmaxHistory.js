import React, { useEffect } from "react";
import { Grid, Paper, Box, Typography, Tab, Tabs, Icon, IconButton, Divider } from "@mui/material";

// import { armors, decos } from "../data/EquipData";
// import { staticSkillData } from "../data/StaticData";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import HistoryIcon from "@mui/icons-material/History";
import PropTypes from "prop-types";
import CopyToClipboardButton from "./CopyToClipboardButton";
import { theme } from "./ThemeProvider";
import { LDThemeContext } from "./LDThemeContext";

function NewlineText({ text }) {
  const newText = text
    .split("\n")
    .map((str, index, array) => (index === array.length - 1 ? str : `${str}<br/>`))
    .join("");

  return <span dangerouslySetInnerHTML={{ __html: newText }} />;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography sx={{ fontSize: "14px" }}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export const DmaxHistory = ({ allDmaxOutput }) => {
  // const dmaxResult = outputToResult(
  //   middleOutput,
  //   processingUserInputData,
  //   processingUserArmorsData
  // );

  const options = [];
  const [historyList, setHistoryLists] = React.useState(options);

  let latestTimeStamp;
  React.useEffect(() => {
    console.log("HistoryMenu useEffect called");
    const resultHistory = localStorage.getItem("resultHistory");
    if (resultHistory) {
      console.log("resultHistory is found");
      let resultHistoryArray = JSON.parse(resultHistory);
      if (resultHistoryArray.length > 1) {
        if (allDmaxOutput !== "") {
          resultHistoryArray = resultHistoryArray.slice(1);
        }
        latestTimeStamp = resultHistoryArray[0].timeStamp;
        setHistoryLists(resultHistoryArray);
      }
    }
  }, [allDmaxOutput]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [textToCopy, setTextToCopy] = React.useState("");
  useEffect(() => {
    if (historyList.length === 0) return;
    setTextToCopy(historyList[value].result);
  }, [value, historyList]);

  const { currentTheme } = React.useContext(LDThemeContext);

  return (
    <Grid item xs={12} md={6}>
      <Paper elevation={2}>
        <Grid container alignItems="center" sx={{ padding: "4px 8px" }}>
          <Grid item>
            <HistoryIcon sx={{ marginTop: "4px", marginLeft: "8px" }} color="primary" />
          </Grid>
          <Grid item xs>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, paddingLeft: "4px" }}>
              履歴
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <CopyToClipboardButton textToCopy={textToCopy} />
          </Grid>
        </Grid>
        <Box sx={{ marginX: "8px" }}>
          <Divider xs={{ margin: "8px" }} />
        </Box>
        <Box
          style={{
            height: "900px",
            overflowY: "auto",
            paddingLeft: "8px",
            textAlign: "left",
            display: "flex", // Flexboxを使用
            flexDirection: "row-reverse", // 水平方向にコンポーネントを配置
          }}
        >
          <Box
            sx={{
              flexGrow: 0,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              mr: 0,
              border: 0,
            }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              // scrollButtons="hidden"
              aria-label="Vertical tabs example"
              sx={{
                borderRight: 1,
                borderColor: "divider",
                width: "80px",
                height: "900px",
                // インジケータのスタイルをオーバーライドする
                "& .MuiTabs-indicator": {
                  left: 0, // インジケータを左側に配置
                  right: "auto", // right プロパティの自動設定を解除（デフォルトのスタイルを上書き）
                },
              }}
            >
              {historyList.map((option) => (
                <Tab
                  sx={{ alignItems: "start" }}
                  label={
                    <>
                      <Typography
                        sx={{ fontSize: "14px", color: currentTheme.palette.primary.light }}
                        align="left"
                      >
                        {option.physicalHitzone} / {option.elementalHitzone}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "14px", color: currentTheme.palette.primary.light }}
                        align="left"
                      >
                        {option.element} {option.maxDamage.split(".")[0]}
                      </Typography>

                      <Typography
                        sx={{ fontSize: "10px", color: currentTheme.palette.text.primary }}
                        align="left"
                      >
                        {new Date(option.timeStamp).toLocaleDateString(undefined, {
                          year: undefined,
                          month: "2-digit",
                          day: "2-digit",
                        })}{" "}
                        {new Date(option.timeStamp).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </Typography>
                    </>
                  }
                />
              ))}
            </Tabs>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box
            sx={{
              flexGrow: 1, // コンテナの残りのスペースを埋める
              overflowY: "auto", // 縦方向のスクロールを許可
              p: 2,

              "&::-webkit-scrollbar": {
                display: "none", // Webkitブラウザ用のスクロールバーを非表示にする
              },
              // MSIEやEdge用の設定
              "msOverflowStyle": "none", // IE 10+ スクロールバーを非表示
              "scrollbarWidth": "none", // Firefox スクロールバーを非表示
            }}
          >
            {historyList.map((option, index) => (
              <TabPanel value={value} index={index}>
                <NewlineText text={option.result} />
              </TabPanel>
            ))}
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default DmaxHistory;
