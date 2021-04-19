import React, { useEffect, useState } from "react";
import GroupAddOutlinedIcon from "@material-ui/icons/GroupAddOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  getAllMember,
  inviteMember,
  getGroupMember,
  getUserIdByEmail,
} from "../../service/services";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";

export const ModalInviteMember = ({ open, onClose, groupId, memberEmails }) => {
  const dispatch = useDispatch();
  const [memberList, setMemberList] = useState([]);
  const [memberId, setMemberId] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const user = useSelector((state) => state.userReducer.user);

  useEffect(() => {
    const source = Axios.CancelToken.source();
    const loadData = async () => {
      try {
        const response = await getAllMember(source.token);
        setMemberList(
          response.data
            .filter((val) => !memberEmails.includes(val.user_email))
            .filter((val) => val.user_email !== user.email)
        );
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
      setMemberList([]);
    };
  }, [open, groupId, memberEmails]);

  const inviteNewMember = async () => {
    const source = Axios.CancelToken.source();
    try {
      const checkRequest = await getGroupMember(groupId, source.token);
      const alreadySend =
        checkRequest.data.filter((e) => e.id_user === memberId).length > 0;
      if (alreadySend) {
        dispatch({
          type: "SET_ALERT",
          payload: {
            condition: true,
            message: "Invitation already sent",
            style: "info",
          },
        });
      } else {
        const response = await inviteMember(
          {
            id_user: memberId,
            id_group: groupId,
          },
          source.token
        );
        if (response.status === 200) {
          onClose();
          dispatch({
            type: "SET_ALERT",
            payload: {
              condition: true,
              message: "Invitation has been sent",
              style: "success",
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

  useEffect(() => {
    const getMemberId = async () => {
      try {
        const userResponse = await getUserIdByEmail(emailInput);
        if (userResponse.data.length !== 0 && userResponse.status === 200) {
          setMemberId(userResponse.data[0].id_user);
        }
      } catch (err) {
        if (Axios.isCancel(err)) {
          console.log(err);
        } else {
          throw err;
        }
      }
    };
    getMemberId();
  }, [emailInput, memberEmails, memberList]);

  return (
    <Dialog open={open} onClose={onClose}>
      <Box display="flex" paddingLeft={3} paddingRight={3} alignItems="center">
        <GroupAddOutlinedIcon htmlColor="#172026" />
        <DialogTitle className="modal__invite_title">
          Invite member to your group
        </DialogTitle>
      </Box>
      <DialogContent>
        <Autocomplete
          options={memberList.map((val) => val.user_email)}
          onChange={(e, value) => {
            if (value !== null) {
              const selectedEmail = memberList.filter(
                (val) => val.user_email === value
              )[0].user_email;
              setEmailInput(selectedEmail);
            } else {
              setEmailInput("");
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Insert member email" type="text" />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="modal__invite_cancel">
          Cancel
        </Button>
        <Button className="modal__invite_confirm" onClick={inviteNewMember}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};
