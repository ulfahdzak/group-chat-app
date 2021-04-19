import React from "react";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import { GoogleLogout } from "react-google-login";
import { useDispatch } from "react-redux";
import { IconButton, Tooltip } from "@material-ui/core";
export const LogoutButton = () => {
  const dispatch = useDispatch();
  const logoutFunc = () => dispatch({ type: "SET_LOGIN", payload: false });
  return (
    <>
      <GoogleLogout
        clientId="60866422477-9kjn2dnc4j5k93e7uenrarg2k6nil6hn.apps.googleusercontent.com"
        onLogoutSuccess={logoutFunc}
        render={(renderProps) => (
          <Tooltip title="Logout? 😞" placement="top-start">
            <IconButton onClick={renderProps.onClick}>
              <ExitToAppRoundedIcon />
            </IconButton>
          </Tooltip>
        )}
      />
    </>
  );
};
