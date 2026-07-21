import API from "../api/axios";
import { PROFILE_ROUTES } from "../routes/api.routes";

export const userProfileService = {
  getProfile: async (id) => {
    const res = await API.get(`/profile/me/${id}`);
    return res.data;
  },

  updateProfile: async (id, data) => {
    const res = await API.put(`/profile/${id}`, data);
    return res.data;
  },
};
