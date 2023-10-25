import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Typography } from "@mui/material";
import { theme } from "./ThemeProvider";

const ITEM_HEIGHT = 48;

export default function HistoryMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = [];
  const [historyOptions, setHistoryOptions] = React.useState(options);

  let latestTimeStamp;
  React.useEffect(() => {
    console.log("HistoryMenu useEffect called");
    const resultHistory = localStorage.getItem("resultHistory");
    if (resultHistory) {
      console.log("resultHistory is found");
      const resultHistoryArray = JSON.parse(resultHistory);
      latestTimeStamp = resultHistoryArray[resultHistoryArray.length - 1].timeStamp;
      setHistoryOptions(resultHistoryArray);
    }
  }, []);

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {historyOptions.map((option) => (
          <MenuItem
            key={option.timeStamp}
            selected={option.timeStamp === latestTimeStamp}
            onClick={handleClose}
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: "16px",
                color: theme.palette.primary.main,
                textAlign: "left",
                width: "100%",
              }}
            >
              {option.timeStamp}
            </Typography>
            <Typography
              variant="body1"
              component={"div"}
              sx={{
                fontSize: "16px",
                color: theme.palette.text.secondary,
                textAlign: "left",
                width: "100%",
              }}
            >
              {JSON.stringify(option)}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
