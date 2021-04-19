import { combineReducers } from "redux";
import {
  SET_LOGIN,
  SET_USER,
  SEARCH_GROUP,
  SELECT_GROUP,
  SET_PUBLIC_GROUP,
  SET_MEMBER_GROUP,
  SET_ALERT,
} from "./action";
import { initialState } from "./state";
const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGIN:
      return {
        ...state,
        isLogin: action.payload,
      };

    default:
      return state;
  }
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_GROUP:
      return {
        ...state,
        groupSearch: action.payload,
      };
    case SELECT_GROUP:
      return {
        ...state,
        groupIdSelected: action.payload,
      };
    case SET_PUBLIC_GROUP:
      return {
        ...state,
        publicGroup: [...action.payload],
      };
    case SET_MEMBER_GROUP:
      return {
        ...state,
        memberGroup: [...action.payload],
      };
    default:
      return state;
  }
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALERT:
      return {
        ...state,
        isAlert: action.payload,
      };

    default:
      return state;
  }
};

export const reducer = combineReducers({
  loginReducer,
  userReducer,
  groupReducer,
  alertReducer,
});
