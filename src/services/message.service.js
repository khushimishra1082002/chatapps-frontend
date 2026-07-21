import API from "../api/axios";
import { MESSAGES_ROUTES } from "../routes/api.routes";

export const messageService = {
  getMessages: (conversationId) =>
    API.get(`${MESSAGES_ROUTES.GET_MESSAGE}/${conversationId}`),
  sendMessages: (data) => {
    return API.post(MESSAGES_ROUTES.SEND_MESSAGE, data);
  },
};
