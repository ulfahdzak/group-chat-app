import http from "./htpp-common";

export const getSelectedGroupData = (groupId, userId, token) => {
  return http.get(`/get/group/request/${groupId}/${userId}`, {
    cancelToken: token,
  });
};

export const getMessage = (groupId, token) => {
  return http.get(`/get/message/${groupId}`, { cancelToken: token });
};

export const postMessage = (data) => {
  return http.post(`/send/message`, data);
};

export const deleteGroupAdmin = (groupId) => {
  return http.delete(`/delete/group/${groupId}`);
};

export const deleteGroupMember = (userId, groupId, status) => {
  return http.delete(`/delete/request/${userId}/${groupId}/${status}`);
};

export const getMember = (userId) => {
  return http.get(`/get/member/${userId}`);
};

export const getAllMember = (token) => {
  return http.get(`/get/member`, {
    cancelToken: token,
  });
};

export const inviteMember = (data, token) => {
  return http.post(`/invite/member`, data, { cancelToken: token });
};

export const getPublicGroups = (token) => {
  return http.get(`/get/group`, { cancelToken: token });
};

export const getMemberGroup = (userId) => {
  return http.get(`/get/group/${userId}`);
};

export const createGroup = (data, token) => {
  return http.post(`/create/group`, data, { cancelToken: token });
};

export const joinGroup = (data, token) => {
  return http.post(`/join/group`, data, { cancelToken: token });
};

export const getGroupMember = (groupId, token) => {
  return http.get(`/get/group/member/${groupId}`, { cancelToken: token });
};

export const getUserIdByEmail = (userEmail) => {
  return http.get(`/get/member/email/${userEmail}`);
};

export const updateMember = (data) => {
  return http.put(`/update/member`, data);
};

export const declineGroup = (userId, groupId) => {
  return http.delete(`/delete/request/${userId}/${groupId}`);
};
