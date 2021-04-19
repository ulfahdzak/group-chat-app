export const SET_LOGIN = "SET_LOGIN";
export const SET_USER = "SET_USER";
export const SEARCH_GROUP = "SEARCH_GROUP";
export const SELECT_GROUP = "SELECT_GROUP";
export const SET_PUBLIC_GROUP = "SET_PUBLIC_GROUP";
export const SET_MEMBER_GROUP = "SET_MEMBER_GROUP";
export const SET_ALERT = "SET_ALERT";

export const setLogin = (isLogin) => {
  return {
    type: SET_LOGIN,
    payload: isLogin,
  };
};

export const addUser = (userData) => {
  return {
    type: SET_USER,
    payload: userData,
  };
};

export const searchGroup = (groupName) => {
  return {
    type: SEARCH_GROUP,
    payload: groupName,
  };
};

export const selectGroup = (groupId) => {
  return {
    type: SELECT_GROUP,
    payload: groupId,
  };
};

export const setPublicGroup = (groupData) => {
  return {
    type: SET_PUBLIC_GROUP,
    payload: groupData,
  };
};

export const setMemberGroup = (groupData) => {
  return {
    type: SET_MEMBER_GROUP,
    payload: groupData,
  };
};

export const setAlert = (alertData) => {
  return {
    type: SET_ALERT,
    payload: alertData,
  };
};
