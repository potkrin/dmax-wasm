import React, { useState } from "react";
import "./App.css";
import { Tabs, Tab, Container, Box } from "@mui/material";
import { DmaxMain } from "./components/DmaxMain";

/**
 * TODO:
 *   - スキルの検索ボックス。文字列がヒットしたもののみ残る
 *   - state 更新の軽量化
 */

function TabPanel(props) {
  const { children, value, index } = props;

  const hiddenStyle = {
    display: value === index ? "block" : "none",
  };

  return (
    <div style={hiddenStyle}>
      <Box p={3}>{children}</Box>
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <Container sx={{ marginY: 5 }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Tab 1" />
          <Tab label="Tab 2" />
          <Tab label="Tab 3" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <DmaxMain />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <p>Tab 2 content</p>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <p>Tab 3 content</p>
        </TabPanel>
      </Container>
    </div>
  );
}

export default App;
