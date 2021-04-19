import React from "react";
import { useStyle } from "../styles/CompStyles";
import { Box, Avatar } from "@material-ui/core";
export const SidebarHeader = ({ userEmail, userName, userImage }) => {
  const classes = useStyle();
  return (
    <>
      <Box
        marginTop={3}
        className="chatroom_title_container"
        display="flex"
        alignItems="center"
      >
        <Avatar className={classes.header__image} src={userImage} />
        <Box marginLeft={1} flexDirection="column">
          <h1 className={classes.header__name}>{userName}</h1>
          <p className="sidebar__email">{userEmail}</p>
        </Box>
      </Box>
    </>
  );
};
