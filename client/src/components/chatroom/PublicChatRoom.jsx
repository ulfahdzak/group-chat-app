import React, { useEffect, useState, useRef } from "react";
import { Grid, Box, CircularProgress } from "@material-ui/core";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  getMemberGroup,
  getPublicGroups,
  joinGroup,
  updateMember,
} from "../../service/services";
import { CustomInput, PublicBox } from "../commons";
import "../../styles/PublicChatRoom.css";
import { Fragment } from "react";

export const PublicChatRoom = () => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const [groupSearch, setGroupSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(8);

  const user = useSelector((state) => state.userReducer.user);
  const publicGroup = useSelector((state) => state.groupReducer.publicGroup);

  const publicGroupFilter = publicGroup
    .filter((val) => val.group_name !== null && val.member !== 0)
    .filter((val) =>
      val.group_name.toLowerCase().includes(groupSearch.toLowerCase())
    );

  useEffect(() => {
    const source = Axios.CancelToken.source();
    const loadData = async () => {
      try {
        const response = await getPublicGroups(source.token);
        setIsLoading(true);
        if (response.status === 200) {
          dispatch({ type: "SET_PUBLIC_GROUP", payload: response.data });
          setIsLoading(false);
        }
      } catch (err) {
        if (Axios.isCancel(err)) {
          console.log("Cancelled");
        } else {
          throw err;
        }
      }
    };

    loadData();

    return () => {
      source.cancel();
    };
  }, [publicGroup]);

  const joinNewGroup = async (groupId) => {
    try {
      const newData = { id_user: user.googleId, id_group: groupId };
      const getMember = await getMemberGroup(user.googleId);
      const isAdmin =
        getMember.data.filter(
          (val) => val.id_group === groupId && val.status === "admin"
        ).length !== 0;
      const isMember =
        getMember.data.filter(
          (val) => val.id_group === groupId && val.status === "member"
        ).length !== 0;
      const isPending =
        getMember.data.filter(
          (val) => val.id_group === groupId && val.status === "pending"
        ).length !== 0;
      if (!isAdmin && !isMember && !isPending) {
        const response = await joinGroup(newData);
        if (response.status === 200) {
          const getMember = await getMemberGroup(user.googleId);
          dispatch({ type: "SET_MEMBER_GROUP", payload: getMember.data });
          dispatch({ type: "SELECT_GROUP", payload: groupId });
        }
      } else {
        dispatch({ type: "SELECT_GROUP", payload: groupId });
      }

      if (isPending) {
        const updateResponse = await updateMember(newData);
        if (updateResponse.status === 200) {
          const getMember = await getMemberGroup(user.googleId);
          dispatch({ type: "SELECT_GROUP", payload: groupId });
          dispatch({ type: "SET_MEMBER_GROUP", payload: getMember.data });
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

  return (
    <Grid className="public_chat__container" container spacing={3}>
      {isLoading && <CircularProgress />}
      <Grid className="public_chat__search" item lg={12} xs={12}>
        <h1 className="section__title">Chatroom!</h1>
        <CustomInput
          label="Search open chatroom discussion"
          value={groupSearch}
          width="22rem"
          handleChange={(event) => setGroupSearch(event.currentTarget.value)}
          type="text"
        />
      </Grid>

      <Grid
        ref={containerRef}
        className="public_chat__list"
        onScroll={(event) => {
          const scrollPosition =
            containerRef.current.scrollHeight - containerRef.current.scrollTop;
          if (scrollPosition === containerRef.current.clientHeight) {
            setLimit(limit + 7);
            console.log(limit);
          }
        }}
        lg={12}
        xs={12}
        item
      >
        {publicGroupFilter.slice(0, limit).map((data, index) => (
          <Fragment key={index}>
            <PublicBox
              groupId={data.id_group}
              groupName={data.group_name}
              sumOfMember={data.member}
              joinGroup={joinNewGroup}
            />
          </Fragment>
        ))}

        {publicGroupFilter.length > 7 && (
          <Box
            display="inline-block"
            marginRight={2}
            marginBottom={2}
            width="fit-content"
            className="group__card_container"
          ></Box>
        )}
      </Grid>
    </Grid>
  );
};
