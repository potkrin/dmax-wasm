import React, { useState } from "react";
import "./App.css";
import { Tabs, Tab, Container, Box, Typography, AppBar } from "@mui/material";
import { DmaxMain } from "./components/DmaxMain";
import { CharmManager } from "./components/CharmManager";
import QuriousArmorManager from "./components/QuriousArmorManager";
import { useTheme } from "@emotion/react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";

/**
 * TODO:
 *   - スキルの検索ボックス。文字列がヒットしたもののみ残る
 */

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
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

function App() {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className="App">
      <Container sx={{ marginY: 5 }}>
        <HideOnScroll>
          <AppBar position="sticky">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="tabs example"
            >
              <Tab label="DMAX" {...a11yProps(0)} />
              <Tab label="護石" {...a11yProps(1)} />
              <Tab label="傀異錬成" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
        </HideOnScroll>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <DmaxMain />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <CharmManager />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <QuriousArmorManager />
          </TabPanel>
        </SwipeableViews>
      </Container>
    </div>
  );
}

export default App;
