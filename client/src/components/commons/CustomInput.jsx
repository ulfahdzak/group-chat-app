import React from "react";
import {
  Box,
  InputLabel,
  Input,
  InputAdornment,
  FormControl,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
export const CustomInput = ({ width, value, label, handleChange, type }) => {
  return (
    <Box>
      <FormControl>
        <InputLabel className="label__custom_input">{label}</InputLabel>
        <Input
          style={{ width: `${width}` }}
          className="custom__input"
          type={type}
          value={value}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon htmlColor="white" />
            </InputAdornment>
          }
        />
      </FormControl>
    </Box>
  );
};
