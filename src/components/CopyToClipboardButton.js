import React from "react";
import { IconButton } from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// クリップボードにテキストをコピーする関数
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

export const CopyToClipboardButton = ({ textToCopy }) => {
  const handleCopyClick = async () => {
    await copyToClipboard(textToCopy);
  };

  return (
    <IconButton onClick={handleCopyClick} aria-label="copy" size="large">
      <ContentCopyIcon sx={{ marginTop: "4px" }} color="primary" />
    </IconButton>
  );
};

export default CopyToClipboardButton;
