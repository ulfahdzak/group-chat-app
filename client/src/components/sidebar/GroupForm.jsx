import {
  Box,
  Switch,
  FormControlLabel,
  InputLabel,
  Button,
  Input,
  FormControl,
  InputAdornment,
} from "@material-ui/core";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import React, { useEffect, useState } from "react";
import {
  createGroup,
  getMemberGroup,
  getPublicGroups,
} from "../../service/services";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import SearchIcon from "@material-ui/icons/Search";
import Axios from "axios";

export const GroupForm = ({ groupHandle }) => {
  const [isPublic, setIsPublic] = useState(false);
  const [groupName, setGroupName] = useState("");
  const dispatch = useDispatch();

  const handleChange = () => setIsPublic(!isPublic);

  const user = useSelector((state) => state.userReducer.user);
  const createNewGroup = () => {
    let source = Axios.CancelToken.source();
    if (groupName !== "") {
      const newGroupData = {
        id_user: user.googleId,
        id_group: uuidv4(),
        group_name: groupName,
        status: isPublic,
      };
      createGroup(newGroupData, source.token).then((res) => {
        if (isPublic) {
          getPublicGroups(source.token).then((res) => {
            dispatch({ type: "SET_PUBLIC_GROUP", payload: res.data });
          });
        }
        if (res.status === 200) {
          getMemberGroup(user.googleId).then((res) =>
            dispatch({ type: "SET_MEMBER_GROUP", payload: res.data })
          );
          setGroupName("");
          setIsPublic(false);
          groupHandle(false);
        }
      });
    } else {
      dispatch({
        type: "SET_ALERT",
        payload: {
          condition: true,
          message: "Insert your group name!",
          style: "error",
        },
      });
    }
  };

  useEffect(() => {
    let source = Axios.CancelToken.source();
    return () => {
      source.cancel("Canceled");
    };
  }, []);

  return (
    <Box width="100%" marginTop={3} display="flex" flexDirection="column">
      <InputLabel
        style={{ margin: "3rem 0rem 1.25rem 0rem", color: "white" }}
        className="group-name"
        htmlFor="group-name"
      >
        Create a new group
      </InputLabel>
      <FormControl>
        <InputLabel className="label__input_password">
          Enter your group name!
        </InputLabel>
        <Input
          id="password__input"
          type="text"
          name="group-name"
          value={groupName}
          autoFocus={true}
          onChange={(e) => setGroupName(e.currentTarget.value)}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon htmlColor="white" />
            </InputAdornment>
          }
        />
      </FormControl>

      <Box marginTop={1} display="flex" justifyContent="space-between">
        <FormControlLabel
          control={
            <Switch
              checked={isPublic}
              onChange={handleChange}
              color="primary"
              name="group_status"
            />
          }
          label="Public ?"
        />
        <Button onClick={createNewGroup} className="btn__create_group">
          <AddRoundedIcon style={{ marginRight: ".25rem" }} /> Create
        </Button>
      </Box>
    </Box>
  );
};
