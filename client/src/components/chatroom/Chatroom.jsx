import React, { useState } from "react";
import { Box, Grid } from "@material-ui/core";
import { ChatroomBody } from "../chatroom";
import { Sidebar } from "../sidebar";
import { Auth } from "../login";
import { CustomeAlert } from "../commons";
import "../../styles/chatroom.css";

export const Chatroom = () => {
  const [showPassPage, setPassPage] = useState(true);

  return (
    <>
      {showPassPage ? (
        <Auth setPassPage={setPassPage} />
      ) : (
        <Box className="chatroom__container">
          <Grid className="chatroom__homepage" container>
            <Grid className="chatroom__sidebar" item lg={3}>
              <Sidebar />
            </Grid>

            <Grid className="chatroom__body" item lg={9}>
              <ChatroomBody />
              <CustomeAlert />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};
