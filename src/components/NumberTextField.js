import React, { useState } from "react";
import { TextField } from "@mui/material";

export function NumberTextField(props) {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    let newValue = parseInt(event.target.value.replace(/\D/g, "")); // 数字以外を削除
    newValue = isNaN(newValue) ? 0 : newValue;
    newValue = props.min > newValue ? props.min : newValue; // minより小さい場合はminにする
    newValue = props.max < newValue ? props.max : newValue; // maxより大きい場合はmaxにする

    setValue(newValue);
    event.target.value = newValue;
    if (props.onChange) {
      props.onChange(event);
    }
  };

  const handleBlur = () => {
    if (props.onBlur) {
      props.onBlur(value);
    }
  };

  const { min, max, ...rest } = props; // minとmaxを分離

  return <TextField {...rest} value={value} onChange={handleChange} onBlur={handleBlur} />;
}

export default NumberTextField;
