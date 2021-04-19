import React, { useState } from "react";
import "../../styles/login.css";
import { useDispatch } from "react-redux";
import FeedbackIcon from "@material-ui/icons/Feedback";
import MuiAlert from "@material-ui/lab/Alert";
import GoogleLogin from "react-google-login";
import { Box, Snackbar } from "@material-ui/core";
export const Login = () => {
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const successFunc = (res) => {
    dispatch({ type: "SET_LOGIN", payload: true });
    dispatch({ type: "SET_USER", payload: res.profileObj });
  };

  const failureFunc = (err) => {
    console.log(err);
    setOpen(true);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      className="login__page"
    >
      <Box
        marginBottom={2}
        justifyContent="center"
        alignItems="center"
        display="flex"
      >
        <FeedbackIcon className="icon__feedback" />
        <h1 className="app__title">Chatroom!</h1>
      </Box>

      <GoogleLogin
        clientId="60866422477-9kjn2dnc4j5k93e7uenrarg2k6nil6hn.apps.googleusercontent.com"
        buttonText="Continue with google!"
        onSuccess={successFunc}
        onFailure={failureFunc}
        theme="dark"
        isSignedIn={true}
        cookiePolicy={"single_host_origin"}
      />

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Failed login with google account!
        </Alert>
      </Snackbar>
    </Box>
  );
};
