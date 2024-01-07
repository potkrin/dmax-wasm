import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

function LoginDialog({ open, onClose, onLogin }) {
  let initAutoRedirect = localStorage.getItem("loginAutoRedirect");
  if (initAutoRedirect === "true") initAutoRedirect = true;
  else initAutoRedirect = false;
  const [autoRedirect, setAutoRedirect] = useState(initAutoRedirect);

  const handleAutoRedirectChange = (event) => {
    setAutoRedirect(event.target.checked);
    localStorage.setItem("loginAutoRedirect", event.target.checked);
  };

  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/login/?next=/dmax`;
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ zIndex: 2000 }}>
      <DialogTitle>ログインが必要です</DialogTitle>
      <DialogContent>
        <DialogContentText>
          この機能を使用するにはログインする必要があります。アカウントにログインしてすべての機能を利用しましょう。
        </DialogContentText>
        <FormControlLabel
          control={<Checkbox checked={autoRedirect} onChange={handleAutoRedirectChange} />}
          label="次回から自動遷移する"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleLogin} color="primary" variant="contained">
          ログイン
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginDialog;
