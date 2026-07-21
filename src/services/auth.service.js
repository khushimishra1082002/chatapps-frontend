import API from "../api/axios";
import { AUTH_ROUTES } from "../routes/api.routes";

export const authService = {
  signup: (data) => API.post(AUTH_ROUTES.SIGNUP, data),

  login: async (data) => {
    const res = await API.post(AUTH_ROUTES.LOGIN, data);
    return res.data; 
  },

  sendOTP: async (data) => {
    const res = await API.post(AUTH_ROUTES.SEND_OTP, data);
    return res.data;
  },

  verifyOTP: async (data) => {
    const res = await API.post(AUTH_ROUTES.VERIFY_OTP, data);
    return res.data;
  },
};
