import React from "react";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import GroupAddRoundedIcon from "@material-ui/icons/GroupAddRounded";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import { Box, IconButton } from "@material-ui/core";
import { useStyle } from "../styles/CompStyles";
import { useDispatch } from "react-redux";
import LockIcon from "@material-ui/icons/Lock";

export const GroupBox = ({
  onAccept,
  onReject,
  isPending,
  isPublic,
  groupId,
  groupName,
}) => {
  const dispatch = useDispatch();
  const classes = useStyle();
  const formatString = (name) => {
    const groupName = name.length > 15 ? `${name.slice(0, 15)} ...` : name;
    return groupName;
  };

  return (
    <Box
      marginTop={2}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      className={`group__item ${isPending && "request__item"}`}
      onClick={() => {
        if (!isPending)
          dispatch({
            type: "SELECT_GROUP",
            payload: groupId,
          });
      }}
    >
      <Box display="flex" alignItems="center">
        {isPublic ? (
          <PeopleAltRoundedIcon
            htmlColor="white"
            className={classes.group__icon}
          />
        ) : (
          <>
            {!isPending ? (
              <LockIcon className={classes.group__icon} htmlColor="white" />
            ) : (
              <GroupAddRoundedIcon
                className={classes.group__icon}
                htmlColor="white"
              />
            )}
          </>
        )}
        <h1 style={{ color: "white" }} className="group__title">
          {formatString(groupName)}
        </h1>
      </Box>

      {!isPending ? (
        <ArrowForwardIosRoundedIcon />
      ) : (
        <Box display="flex">
          <IconButton className="btn__reject" onClick={onReject}>
            <ClearRoundedIcon />
          </IconButton>
          <IconButton className="btn__accept" onClick={onAccept}>
            <CheckRoundedIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
