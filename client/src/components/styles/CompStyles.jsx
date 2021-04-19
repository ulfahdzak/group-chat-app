import { makeStyles } from "@material-ui/core";

export const useStyle = makeStyles({
  btn__arrow: {
    marginTop: 1,
  },

  header__title: {
    fontSize: "1.25rem",
    color: "white",
    marginLeft: ".25rem",
    transition: "all .25s ease-in-out",
  },

  add__icon: {
    color: "white",
  },

  group__icon: {
    width: "1.25rem",
    height: "1.25rem",
  },

  send__icon: {
    marginLeft: ".25rem",
    transform: "rotate(180deg)",
  },

  chatting__input: {
    width: "90%",
    color: "white",
  },

  header__image: {
    marginRight: ".25rem",
    height: "3.25rem",
    width: "3.25rem",
  },

  header__name: {
    fontSize: "1.25rem",
  },
});
