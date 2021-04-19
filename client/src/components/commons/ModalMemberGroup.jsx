import React, { useState } from "react";
import Axios from "axios";
import {
  Modal,
  Box,
  IconButton,
  Avatar,
  Button,
  Input,
} from "@material-ui/core";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import InfoIcon from "@material-ui/icons/Info";
import { useDispatch, useSelector } from "react-redux";
import { deleteGroupMember } from "../../service/services";

export const ModalMemberGroup = ({ open, onClose, memberList, userStatus }) => {
  const dispatch = useDispatch();
  const groupId = useSelector((state) => state.groupReducer.groupIdSelected);
  const [input, setInput] = useState("");
  const memberListFiltered = memberList.filter(
    (val) =>
      val.user_email.toLowerCase().includes(input.toLowerCase()) ||
      val.user_name.toLowerCase().includes(input.toLowerCase())
  );
  const [isDelete, setIsDelete] = useState("");

  const kickMember = async (userId) => {
    try {
      const response = await deleteGroupMember(userId, groupId, "member");
      if (response.status === 200) {
        dispatch({
          type: "SET_ALERT",
          payload: {
            condition: true,
            message: "Member removed!",
            style: "info",
          },
        });
        onClose();
      }
    } catch (err) {
      if (!err) {
        if (Axios.isCancel(err)) {
          console.log(err);
        } else {
          throw err;
        }
      }
    }
  };

  return (
    <>
      <Modal className="group_info__backdrop" open={open} onClose={onClose}>
        <Box className="group_info__container">
          <Box display="flex" alignItems="center" marginBottom={2}>
            <InfoIcon
              style={{ width: "1.6rem", height: "1.6rem" }}
              htmlColor="#172026"
            />
            <h1 className="group__info_title">Group info</h1>
          </Box>
          <Input
            className="confirmation__input"
            placeholder="Enter member's name"
            type="text"
            autoFocus={true}
            onChange={(e) => {
              e.preventDefault();
              setInput(e.currentTarget.value);
            }}
          />
          <Box className="group_member__container">
            {memberListFiltered.map((val, index) => (
              <Box
                key={index}
                paddingTop={3}
                display="flex"
                justifyContent="space-between"
                className="group_info__member"
              >
                <Box display="flex" alignItems="center">
                  <Avatar className="member__picture" src={val.user_pic} />
                  <Box marginLeft={2}>
                    <h1 className="member__username">{val.user_name}</h1>
                    <h2 className="member__email">
                      {val.user_email} {val.status === "admin" && "(admin)"}
                    </h2>
                  </Box>
                </Box>
                {userStatus === "admin" && val.status === "member" && (
                  <>
                    {isDelete === val.id_user ? (
                      <Box display="flex">
                        <Button
                          className="btn__kick_member"
                          onClick={() => kickMember(val.id_user)}
                        >
                          Kick
                        </Button>
                        <Button
                          className="btn__cancel_kick"
                          onClick={() => setIsDelete("")}
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <IconButton
                          className="btn__kick_member"
                          onClick={() => setIsDelete(val.id_user)}
                        >
                          <ClearRoundedIcon htmlColor="darkred" />
                        </IconButton>
                      </>
                    )}
                  </>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </>
  );
};
