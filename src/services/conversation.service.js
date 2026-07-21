import API from "../api/axios";
import { CONVERSATION_ROUTES } from "../routes/api.routes";

export const conversationService = {
  getConversation: () => API.get(CONVERSATION_ROUTES.GET_CONVERSATION),
  createDirectConversation: (userId) =>
    API.post(CONVERSATION_ROUTES.CREATE_DIRECT_CONVERSATION, { userId }),
  createGroupConversation: (data) =>
    API.post(CONVERSATION_ROUTES.CREATE_GROUP_CONVERSATION, data),
  getConversationGroupMembers: (id) =>
    API.get(`/conversation/${id}/groupMember`),
  markReads: (conversation_id) => {
    return API.post(`/conversation/${conversation_id}`);
  },
};
