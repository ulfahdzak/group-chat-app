import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import "../../styles/messagebox.css";
import Emoji from "react-emoji-render";

const formatDate = (ms) => {
  const date = new Date(ms);
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${hours}:${minutes}`;
};

export const MessageBox = ({ data, scrollToBottom, currentUserId }) => {
  const [messageData] = useState(data);
  useEffect(() => {
    scrollToBottom();
  }, [messageData]);

  return (
    <Box
      className="message__box"
      display="flex"
      justifyContent={
        currentUserId === data.id_user ? "flex-start" : "flex-end"
      }
    >
      <Box
        bgcolor={currentUserId === data.id_user ? "white" : "#ffffff80"}
        marginRight={3}
        marginLeft={3}
        className="bubble__chat"
      >
        <Box
          display="flex"
          alignItems="center"
          style={{ overflowWrap: "anywhere" }}
        >
          <Avatar className="user__picture" src={data.user_pic} />
          <h1 className="user__name">{data.user_name}</h1>
        </Box>
        <Box
          display="flex"
          style={{ overflowWrap: "anywhere" }}
          justifyContent="flex-end"
          alignItems="center"
        >
          <p className="user__message">
            <Emoji text={data.message} />
          </p>
        </Box>
        <Box display="flex" marginTop={2} justifyContent="flex-end">
          <p className="message__time">{formatDate(data.timestamp)}</p>
        </Box>
      </Box>
    </Box>
  );
};
