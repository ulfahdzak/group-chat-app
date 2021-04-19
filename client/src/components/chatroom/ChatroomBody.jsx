import React from "react";
import { Box } from "@material-ui/core";
import { PublicChatRoom, ChatroomConversation } from "../chatroom";
import { useSelector } from "react-redux";
export const ChatroomBody = () => {
  const groupId = useSelector((state) => state.groupReducer.groupIdSelected);
  return (
    <Box width="100%">
      {groupId === "" ? <PublicChatRoom /> : <ChatroomConversation />}
    </Box>
  );
};
