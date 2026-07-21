export const AUTH_ROUTES = {
  SIGNUP: "/auth/signup",
  LOGIN: "/auth/login",
  SEND_OTP: "/auth/send-otp",
  VERIFY_OTP: "/auth/verify-otp",
};

export const USER_ROUTES = {
  GETALL: "/user/",
  SEARCH_USER: "/user/search",
};

export const CONVERSATION_ROUTES = {
  GET_CONVERSATION: "/conversation",
  CREATE_DIRECT_CONVERSATION: "/conversation/direct",
  CREATE_GROUP_CONVERSATION: "/conversation/group",
};

export const MESSAGES_ROUTES = {
  GET_MESSAGE: "/message",
  SEND_MESSAGE: "/message",
};

export const PROFILE_ROUTES = {
  GET_PROFILE: "/profile/me",
  UPDATE_PROFILE: "/profile/",
};

export const ATTACHMENT_ROUTES = {
  UPLOAD_ATTACHMENT: "/attachment/upload",
};
