import API from "../api/axios";
import { USER_ROUTES } from "../routes/api.routes";

export const userService = {
  getAll: () => API.get(USER_ROUTES.GETALL),

  searchUser: (query) => API.get(`${USER_ROUTES.SEARCH_USER}?query=${query}`),
};
