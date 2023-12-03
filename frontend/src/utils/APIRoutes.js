import { constants } from "./env";

export const host = constants.SERVER_HOST_URL;
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const getAllMessagesRoute = `${host}/api/messages/getmsg`;
export const updateNameRoute = `${host}/api/auth/updatename`;
export const updateEmailRoute = `${host}/api/auth/updateemail`;
export const updatePasswordRoute = `${host}/api/auth/updatepassword`;
export const deleteUserRoute = `${host}/api/auth/deleteuser`;
export const getUserRoute = `${host}/api/auth/getuser`;