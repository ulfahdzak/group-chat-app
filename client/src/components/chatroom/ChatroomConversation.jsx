import React, { useState, useEffect, useRef } from "react";
import {
  Fade,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Input,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import { useStyle } from "../styles/CompStyles";
import { MessageBox, MenuTools } from "../commons";
import { v1 as uuid } from "uuid";
import {
  getSelectedGroupData,
  getMessage,
  postMessage,
  getMemberGroup,
  getGroupMember,
} from "../../service/services";
import Axios from "axios";

export const ChatroomConversation = () => {
  const [message, setMessage] = useState("");
  const chatRoomEl = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.userReducer.user);
  const userId = user.googleId;
  const groupId = useSelector((state) => state.groupReducer.groupIdSelected);
  const classes = useStyle();

  const [messageList, setMessageList] = useState([]);
  const [groupData, setGroupData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    let source = Axios.CancelToken.source();

    const loadData = async () => {
      try {
        const response = await Axios.all([
          getSelectedGroupData(groupId, userId, source.token),
          getMessage(groupId, source.token),
        ]);
        if (response[0].status === 200 && response[1].status === 200) {
          setIsLoading(false);
        }
        if (response[0].data.length !== 0) {
          setMessageList([...response[1].data]);
          setGroupData([...response[0].data]);
        } else {
          const response = await getMemberGroup(userId);
          dispatch({
            type: "SET_ALERT",
            payload: {
              condition: true,
              message: "Group has been deleted!",
              style: "warning",
            },
          });
          dispatch({ type: "SET_MEMBER_GROUP", payload: response.data });
          dispatch({ type: "SELECT_GROUP", payload: "" });
        }
      } catch (error) {
        if (Axios.isCancel(error)) {
          console.log("Error");
        } else {
          throw error;
        }
      }
    };

    loadData();

    return () => {
      source.cancel("Cancelled");
    };
  }, [groupId, userId, dispatch]);

  const sendMessage = async () => {
    try {
      const timestamp = new Date().getTime();
      let messageData = {
        id_message: uuid(),
        id_user: userId,
        id_group: groupId,
        message,
        timestamp,
      };
      if (message !== "") {
        const response = await postMessage(messageData);
        if (response.status === 200) {
          setMessage("");
        }
      }
    } catch (err) {
      if (Axios.isCancel(err)) {
        console.log(err);
      } else {
        throw err;
      }
    }
  };

  const scrollToBottom = () => {
    chatRoomEl.current.scrollTop = chatRoomEl.current.scrollHeight;
  };

  useEffect(() => {
    let source = Axios.CancelToken.source();
    const loadData = async () => {
      try {
        const response = await Axios.all([
          getMessage(groupId, source.token),
          getGroupMember(groupId, source.token),
        ]);
        if (response[0].status === 200 && response[1].status === 200) {
          setMessageList([...response[0].data]);
          const notExist =
            response[1].data.filter((val) => val.id_user === userId).length ===
            0;
          if (notExist) {
            dispatch({ type: "SELECT_GROUP", payload: "" });
            dispatch({
              type: "SET_ALERT",
              payload: {
                condition: true,
                message: "You're removed from group",
                style: "warning",
              },
            });
          }
        }
      } catch (err) {
        if (Axios.isCancel(err)) {
          console.log(err);
        } else {
          throw err;
        }
      }
    };
    loadData();

    return () => {
      source.cancel();
    };
  }, [messageList, groupId, dispatch, userId]);

  return (
    <Box className="chatarea__container">
      <Grid container>
        <Grid className="chatarea__header" item lg={12}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={() =>
                  dispatch({
                    type: "SELECT_GROUP",
                    payload: "",
                  })
                }
              >
                <ArrowBackIosRoundedIcon htmlColor="white" />
              </IconButton>
              <h2 className="chatarea-title">
                {groupData.length !== 0 && groupData[0].group_name}
              </h2>
            </Box>
            <MenuTools
              groupName={
                groupData.length !== 0 && groupData[0].group_name.toLowerCase()
              }
              userStatus={
                groupData.length !== 0 && groupData[0].status.toLowerCase()
              }
              groupId={groupId}
            />
          </Box>
        </Grid>

        <Grid ref={chatRoomEl} className="chatarea__body" item lg={12}>
          {isLoading && (
            <Box
              position="absolute"
              height="100%"
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              className="loading"
            >
              <Fade in={isLoading}>
                <CircularProgress />
              </Fade>
            </Box>
          )}

          {messageList.map((data, key) => (
            <MessageBox
              key={key}
              data={data}
              currentUserId={userId}
              scrollToBottom={scrollToBottom}
            />
          ))}
          <Box marginTop={4} />
        </Grid>

        <Grid item lg={12} className="chatarea__input">
          <Input
            className={classes.chatting__input}
            type="text"
            placeholder="Type a message"
            value={message}
            onKeyPress={(e) => {
              e.key === "Enter" && sendMessage();
            }}
            onChange={(e) => {
              e.preventDefault();
              setMessage(e.currentTarget.value);
            }}
          />
          <IconButton onClick={sendMessage}>
            <ArrowBackIosRoundedIcon className={classes.send__icon} />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};
