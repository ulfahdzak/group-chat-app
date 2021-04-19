import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
export const CustomeAlert = () => {
  const dispatch = useDispatch();
  const alertData = useSelector((state) => state.alertReducer.isAlert);

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch({ type: "SET_ALERT", payload: { condition: false, message: "" } });
  };

  return (
    <>
      <Snackbar
        open={alertData.condition}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={alertData.style}>
          {alertData.message}
        </Alert>
      </Snackbar>
    </>
  );
};
