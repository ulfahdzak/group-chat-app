import React, { useState, useEffect } from "react";
import Axios from "axios";
import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Box,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  Visibility,
  VisibilityOff,
  ArrowForwardRounded,
} from "@material-ui/icons";
import "../../styles/auth.css";

export const Auth = ({ setPassPage }) => {
  const [values, setValues] = useState({
    password: "",
    gender: "male",
    showPassword: false,
  });

  const [available, setAvailable] = useState(false);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const user = useSelector((state) => state.userReducer.user);

  useEffect(() => {
    const user_id = user.googleId;
    Axios.get(`http://localhost:3001/api/get/member/${user_id}`).then((res) => {
      if (res.data.length === 1) {
        setAvailable(true);
        if (res.data[0].user_pass === values.password) {
          setPassPage(false);
        }
      } else {
        setAvailable(false);
      }
    });
  }, [user.googleId, setPassPage, values.password]);

  const loginPost = () => {
    const user_id = user.googleId;
    const user_name = user.givenName;
    const user_email = user.email;
    const user_pic = user.imageUrl;
    const user_pass = values.password;
    const user_gender = values.gender;

    if (values.password === "") {
      setPassPage(true);
    }

    if (!available && values.password !== "") {
      Axios.post("http://localhost:3001/api/create/member", {
        user_id,
        user_name,
        user_email,
        user_pic,
        user_pass,
        user_gender,
      });
      setPassPage(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="auth__page"
    >
      <Box className="input__container">
        {!available && (
          <FormControl className="auth__gender_input">
            <h1 className="gender__label">I'm a</h1>
            <Select
              labelId="gender__input"
              id="gender__input"
              value={values.gender}
              onChange={handleChange("gender")}
            >
              <MenuItem className="gender__text" value="male">
                Male
              </MenuItem>
              <MenuItem className="gender__text" value="female">
                Female
              </MenuItem>
            </Select>
          </FormControl>
        )}

        <FormControl style={{ marginTop: "1rem" }}>
          <InputLabel className="label__input_password">
            {available ? "Insert your PIN!" : "Create new PIN!"}
          </InputLabel>
          <Input
            id="password__input"
            autoFocus={true}
            type={values.showPassword ? "number" : "password"}
            onKeyPress={(evt) =>
              (evt.which < 48 || evt.which > 57) && evt.preventDefault()
            }
            inputMode="numeric"
            value={values.password}
            onChange={handleChange("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword}>
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Box
            className="button__container"
            display="flex"
            justifyContent="flex-end"
          >
            <IconButton onClick={loginPost} className="button__next">
              <ArrowForwardRounded />
            </IconButton>
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
};
