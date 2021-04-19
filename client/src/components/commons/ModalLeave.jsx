import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
} from "@material-ui/core";
import React from "react";
export const ModalLeave = ({
  open,
  onClose,
  setConfirmation,
  leaveGroupFunc,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="modal__leave_title">
        Leave group 🏃‍♂️ ?‍
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="modal__leave_subtitle">
          Are you sure you want to leave this group?
        </DialogContentText>
        <Input
          className="confirmation__input"
          placeholder="Write group name"
          type="text"
          onChange={(e) => setConfirmation(e.currentTarget.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="modal__leave_cancel">
          Cancel
        </Button>
        <Button
          className="modal__leave_confirm"
          onClick={leaveGroupFunc}
          color="secondary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
