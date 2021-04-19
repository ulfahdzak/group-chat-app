import React, { useEffect, useState } from "react";
import { Box, Fab, InputLabel } from "@material-ui/core";
import { useStyle } from "../styles/CompStyles";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import { useSelector, useDispatch } from "react-redux";
import { LogoutButton } from "../login";
import { GroupBox } from "../commons";
import { SidebarSearch, GroupForm, SidebarHeader } from "../sidebar";
import "../../styles/sidebar.css";
import {
  getMemberGroup,
  updateMember,
  declineGroup,
} from "../../service/services";
import Axios from "axios";

export const Sidebar = () => {
  const classes = useStyle();
  const dispatch = useDispatch();
  const [groupData, setGroupData] = useState([]);

  const user = useSelector((state) => state.userReducer.user);
  const userId = user.googleId;

  const group = useSelector((state) => state.groupReducer.memberGroup);
  const groupName = useSelector((state) => state.groupReducer.groupSearch);

  const pendingGroup = group.filter((val) => val.status === "pending");
  const memberGroup = group.filter(
    (val) => val.status === "member" || val.status === "admin"
  );
  const filterGroup = memberGroup.filter((val) =>
    val.group_name.toLowerCase().includes(groupName.toLowerCase())
  );
  const [createGroup, setCreateGroup] = useState(false);
  const createGroupHandle = () => setCreateGroup(!createGroup);

  useEffect(() => {
    const source = Axios.CancelToken.source();
    const getGroupData = async () => {
      try {
        const response = await getMemberGroup(userId);
        setGroupData(response.data);
      } catch (err) {
        if (Axios.isCancel(err)) {
          console.log(err);
        } else {
          throw err;
        }
      }
    };
    getGroupData();

    return () => {
      source.cancel("Cancelled");
    };
  }, [groupData, userId]);

  useEffect(() => {
    const source = Axios.CancelToken.source();
    dispatch({ type: "SET_MEMBER_GROUP", payload: groupData });
    return () => {
      dispatch({ type: "SET_MEMBER_GROUP", payload: [] });
      source.cancel();
    };
  }, [groupData, dispatch]);

  const declinePendingGroup = async (groupPendingId) => {
    try {
      await declineGroup(userId, groupPendingId);
    } catch (err) {
      if (Axios.isCancel(err)) {
        console.log(err);
      } else {
        throw err;
      }
    }
  };

  const acceptGroup = async (groupPendingId) => {
    try {
      const res = await updateMember({
        id_user: userId,
        id_group: groupPendingId,
      });
      if (res.status === 200) {
        dispatch({ type: "SELECT_GROUP", payload: groupPendingId });
        dispatch({
          type: "SET_ALERT",
          payload: {
            condition: true,
            message: `Welcome ${user.name}!`,
            style: "success",
          },
        });
      }
    } catch (err) {
      if (Axios.isCancel(err)) {
        console.log(err);
      } else {
        throw err;
      }
    }
  };

  return (
    <Box className="chatroom__wrapper" display="flex" flexDirection="column">
      <SidebarHeader
        userEmail={user.email}
        userName={user.name}
        userImage={user.imageUrl}
      />

      {createGroup ? (
        <GroupForm groupHandle={createGroupHandle} />
      ) : (
        <SidebarSearch />
      )}

      {pendingGroup.length > 0 && (
        <>
          <InputLabel
            style={{
              marginTop: "2.5rem",
              color: "white",
            }}
            className="group-name"
            htmlFor="group-name"
          >
            Pending invitation
          </InputLabel>

          <Box
            display="flex"
            width="100%"
            height="20vh"
            flexDirection="column"
            className="group__list"
          >
            {pendingGroup.map((val, index) => (
              <GroupBox
                key={index}
                groupId={val.id_group}
                groupName={val.group_name}
                isPending={true}
                onAccept={() => acceptGroup(val.id_group)}
                onReject={() => declinePendingGroup(val.id_group)}
              />
            ))}
          </Box>
        </>
      )}

      <InputLabel
        style={{ marginTop: "1.5rem", paddingBottom: "1rem", color: "white" }}
        className="group-name"
        htmlFor="group-name"
      >
        List group
      </InputLabel>

      <Box
        display="flex"
        width="100%"
        height="75vh"
        flexDirection="column"
        className="group__list"
      >
        {filterGroup.map((val, index) => (
          <GroupBox
            key={index}
            groupId={val.id_group}
            groupName={val.group_name}
            isPublic={val.group_status.data[0]}
          />
        ))}
      </Box>

      <Box
        display="flex"
        paddingLeft={1}
        paddingRight={3}
        paddingBottom={1}
        justifyContent="space-between"
      >
        <LogoutButton />
        <Fab
          onClick={createGroupHandle}
          style={{
            height: "3rem",
            width: "3rem",
            position: "sticky",
            bottom: "1.05rem",
            left: "17rem",
            zIndex: "1",
          }}
          className="btn__add_group"
        >
          {createGroup ? (
            <CloseIcon className={classes.add__icon} />
          ) : (
            <AddIcon className={classes.add__icon} />
          )}
        </Fab>
      </Box>
    </Box>
  );
};
