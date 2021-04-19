import React from "react";
import {
  Box,
  InputLabel,
  Input,
  InputAdornment,
  FormControl,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { useSelector, useDispatch } from "react-redux";
export const SidebarSearch = () => {
  const dispatch = useDispatch();
  const group_name = useSelector((state) => state.groupReducer.groupSearch);
  return (
    <Box width="100%" marginTop={5} display="flex" flexDirection="column">
      <FormControl>
        <InputLabel className="label__input_password">Group name</InputLabel>
        <Input
          id="password__input"
          type="text"
          name="group-name"
          value={group_name}
          onChange={(e) =>
            dispatch({ type: "SEARCH_GROUP", payload: e.currentTarget.value })
          }
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
