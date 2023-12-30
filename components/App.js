import React, { useState, useRef, useEffect, createContext } from "react";
// import "./App.css";
import {
  Tabs,
  Tab,
  Container,
  Box,
  Typography,
  AppBar,
  Fab,
  ThemeProvider,
  createTheme,
  ListItemIcon,
} from "@mui/material";
import { DmaxMain } from "./DmaxMain";
import { CharmManager } from "./CharmManager";
import QuriousArmorManager from "./QuriousArmorManager";
import { ThemeContext, useTheme } from "@emotion/react";
import PropTypes from "prop-types";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { styled } from "@mui/system";

import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { theme } from "./ThemeProvider";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { LDThemeContext, lightTheme, darkTheme } from "./LDThemeContext";
import Usage from "./Usage";

/**
 * TODO:
 *   - スキルの検索ボックス。文字列がヒットしたもののみ残る
 */

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      // タブ切替時にアンマウントされないように display: none で非表示
      style={{ display: value === index ? "block" : "none" }}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {/* タブ切り替えを条件分岐によるレンダーON/OFFで実現すると OFF でアンマウントされ、state がリセットされてしまうので避ける */}
      {children}
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
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// スクロール時に AppBar を隠す
function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const drawerWidth = 240;
const navItems = ["Home", "About", "Contact"];

function App() {
  // const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  // コンテナ幅を起点にFABの位置を決める. 画面幅がコンテナ幅より小さい場合は画面幅を起点にする
  const [containerWidth, setContainerWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const containerRef = useRef(null);
  const [fabRight, setFabRight] = useState(`64px`);

  useEffect(() => {
    // クライアントサイドでのみ window オブジェクトを使用
    setWindowWidth(window.innerWidth);

    // window のリサイズ時に呼び出す関数
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // イベントリスナーを設定
    window.addEventListener("resize", handleResize);

    // クリーンアップ関数でイベントリスナーを削除
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    // window のリサイズ時に呼び出したい関数を定義
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // window のリサイズ時に呼び出したい関数を登録
    window.addEventListener("resize", handleResize);

    if (windowWidth > containerWidth) {
      let rightPx = windowWidth / 2 - containerWidth / 2 + 64;
      // setFabRight(`${rightPx}px`);
      setFabRight(rightPx);

      // setFabRight("74px");

      console.log(
        "windowWidth > containerWidth. windowWidth = " +
          windowWidth +
          ", containerWidth = " +
          containerWidth +
          ", fabRight =" +
          fabRight
      );
    } else {
      setFabRight(64);
      console.log(
        "windowWidth <= containerWidth. windowWidth = " +
          windowWidth +
          ", containerWidth = " +
          containerWidth +
          ", fabRight =" +
          fabRight
      );
    }

    // アンマウント時に実行されるクリーンアップ関数
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth, containerWidth]);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const [currentTheme, setCurrentTheme] = React.useState(
    localStorage.getItem("colorTheme") === "dark" ? darkTheme : lightTheme
  );
  const toggleTheme = () => {
    if (currentTheme === lightTheme) {
      localStorage.setItem("colorTheme", "dark");
    } else {
      localStorage.setItem("colorTheme", "light");
    }
    setCurrentTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "left" }}>
      <Typography variant="h6" sx={{ my: 2, ml: 2 }}>
        DMAX
      </Typography>
      <Divider />
      <List>
        {/* {navItems.map((item) => (
          <ListItem key={item} disablePadding> */}
        {/* <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton> */}
        <ListItem key={"leaderboardLink"} disablePadding>
          <ListItemButton sx={{ color: currentTheme.palette.primary.contrastText }}>
            <ListItemIcon>
              <OpenInNewIcon />
            </ListItemIcon>
            <a
              href="https://www.mhrspeedrun.com/cms/quest/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: currentTheme.palette.text.primary,
                textDecoration: "none",
              }}
            >
              TA集計
            </a>
          </ListItemButton>
        </ListItem>
        <ListItem key={"themeToggle"} disablePadding>
          <ListItemButton onClick={toggleTheme}>
            <ListItemIcon>
              {currentTheme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            <ListItemText primary={currentTheme.palette.mode === "dark" ? "Light" : "Dark"} />
          </ListItemButton>
        </ListItem>
        {/* ))} */}
      </List>
    </Box>
  );

  // // アンマウント-stateリセット問題を引き起こすので使用しない
  // // <div className="App"></div> の背景色を変更するために styled-components を使用
  // const AppDiv = styled("div")(({ theme }) => ({
  //   backgroundColor: theme.palette.background.default,
  // }));

  return (
    <LDThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      <ThemeProvider theme={currentTheme}>
        <div className="App" style={{ backgroundColor: currentTheme.palette.background.default }}>
          {/* <div> のかわりにこちらの <AppDiv> を利用するとタブ切替時にDmaxMain がアンマウントされる謎挙動が発生する */}
          {/* <AppDiv> */}
          {/* <AppBar component="nav">
                 </AppBar> */}
          <HideOnScroll>
            <AppBar component="nav" position="sticky">
              {/* <Toolbar variant="dense" sx={{ backgroundColor: theme.palette.primary.main }}> */}
              <Toolbar variant="dense">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
                >
                  DMAX
                </Typography>
                {/* <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map((item) => (
                <Button key={item} sx={{ color: "#fff" }}>
                  {item}
                </Button>
              ))}
            </Box> */}
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Button sx={{ color: currentTheme.palette.primary.contrastText }}>
                    <a
                      href="https://www.mhrspeedrun.com/cms/quest/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: currentTheme.palette.primary.contrastText,
                        textDecoration: "none",
                      }}
                    >
                      TA集計
                    </a>
                  </Button>
                  <Button
                    onClick={toggleTheme}
                    color="inherit"
                    startIcon={
                      currentTheme.palette.mode === "dark" ? (
                        <Brightness7Icon />
                      ) : (
                        <Brightness4Icon />
                      )
                    }
                    style={{ textTransform: "none" }}
                  >
                    {currentTheme.palette.mode === "dark" ? "Light" : "Dark"}
                  </Button>
                </Box>
              </Toolbar>

              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="tabs example"
                sx={{ minHeight: "0px" }}
              >
                <Tab label="最適化" sx={{ minHeight: "0px" }} {...a11yProps(0)} />
                <Tab label="護石" sx={{ minHeight: "0px" }} {...a11yProps(1)} />
                <Tab label="傀異錬成" sx={{ minHeight: "0px" }} {...a11yProps(2)} />
                <Tab label="使い方" sx={{ minHeight: "0px" }} {...a11yProps(3)} />
              </Tabs>
            </AppBar>
          </HideOnScroll>
          <nav>
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
              }}
            >
              {drawer}
            </Drawer>
          </nav>

          <Container
            ref={containerRef}
            sx={{
              paddingLeft: "0px !important",
              paddingRight: "0px !important",
              marginBottom: "0px !important", // 追加
              paddingBottom: "0px !important", // 追加
            }}
          >
            {/* Note: SwipeableViews 内にいれると Fab の position: fixed が効かなくなるので無効化 */}

            <TabPanel value={value} index={0} dir={theme.direction}>
              <DmaxMain fabRight={fabRight} setFabRight={setFabRight} />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <CharmManager />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <QuriousArmorManager />
            </TabPanel>
            <TabPanel value={value} index={3} dir={theme.direction}>
              <Usage />
            </TabPanel>
          </Container>
        </div>
        {/* </AppDiv> */}
        {/* <div> のかわりにこちらの <AppDiv> を利用するとタブ切替時にDmaxMain がアンマウントされる謎挙動が発生する */}
      </ThemeProvider>
    </LDThemeContext.Provider>
  );
}

export default App;
