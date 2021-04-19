import React, { useState, useEffect } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import GroupAddOutlinedIcon from "@material-ui/icons/GroupAddOutlined";
import { ModalMemberGroup, ModalInviteMember, ModalLeave } from "../commons";
import { IconButton, Popover, Box } from "@material-ui/core";
import {
  deleteGroupAdmin,
  deleteGroupMember,
  getMemberGroup,
  getGroupMember,
} from "../../service/services";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/MenuTools.css";
import Axios from "axios";

export const MenuTools = ({ groupName, userStatus, groupId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const userId = user.googleId;

  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmation, setConfirmation] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [emailMemberList, setEmailMemberList] = useState([]);

  const [display, setDisplay] = useState({
    invite: false,
    info: false,
    leave: false,
  });
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDisplay({
      invite: false,
      info: false,
      leave: false,
    });
  };

  const handleShow = (props) => {
    handleClose();
    setDisplay({
      ...display,
      [props]: true,
    });
  };

  useEffect(() => {
    const source = Axios.CancelToken.source();
    const getMember = async () => {
      try {
        const response = await getGroupMember(groupId, source.token);
        const groupMemberList = response.data.filter(
          (e) => e.status !== "pending"
        );
        setMemberList([...groupMemberList]);
        groupMemberList.map((val) =>
          setEmailMemberList([...memberList, val.user_email])
        );
      } catch (err) {
        if (Axios.isCancel(err)) {
          console.log(err);
        } else {
          throw err;
        }
      }
    };
    getMember();
    return () => {
      source.cancel();
    };
  }, [groupId, display]);

  const leaveGroup = async () => {
    try {
      if (groupName === confirmation.toLowerCase()) {
        if (userStatus === "admin") {
          const response = await deleteGroupAdmin(groupId);
          if (response.status === 200) {
            const response = await getMemberGroup(userId);
            dispatch({ type: "SET_MEMBER_GROUP", payload: response.data });
            dispatch({ type: "SELECT_GROUP", payload: "" });
          }
        } else {
          const response = await deleteGroupMember(userId, groupId, "member");
          if (response.status === 200) {
            const response = await getMemberGroup(userId);
            dispatch({ type: "SET_MEMBER_GROUP", payload: response.data });
            dispatch({ type: "SELECT_GROUP", payload: "" });
          }
        }
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
    } catch (err) {
      if (Axios.isCancel(err)) {
        console.log("Cancelled");
      } else {
        throw err;
      }
    }
  };

  return (
    <div>
      <Popover
        open={open}
        className="groups__container"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handleClose}
      >
        <Box
          marginTop={1}
          onClick={() => handleShow("info")}
          className="menu__container"
        >
          <InfoOutlinedIcon htmlColor="#172026" />
          <h1 className="menu__text">Group info</h1>
        </Box>

        {userStatus === "admin" && (
          <Box onClick={() => handleShow("invite")} className="menu__container">
            <GroupAddOutlinedIcon htmlColor="#172026" />
            <h1 className="menu__text">Invite member</h1>
          </Box>
        )}

        <Box onClick={() => handleShow("leave")} className="menu__container">
          <ExitToAppOutlinedIcon htmlColor="#303030" />
          <h1 className="menu__text">Leave group</h1>
        </Box>
      </Popover>

      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      <ModalLeave
        open={display.leave}
        onClose={handleClose}
        setConfirmation={setConfirmation}
        leaveGroupFunc={leaveGroup}
      />

      <ModalInviteMember
        userId={userId}
        groupId={groupId}
        open={display.invite}
        onClose={handleClose}
        memberEmails={emailMemberList}
      />

      <ModalMemberGroup
        open={display.info}
        onClose={handleClose}
        userStatus={userStatus}
        memberList={memberList}
      />
    </div>
  );
};
