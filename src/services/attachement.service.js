import API from "../api/axios";
import { ATTACHMENT_ROUTES } from "../routes/api.routes";

export const attachmentService = {
  uploadAttachment: (data) =>
    API.post(ATTACHMENT_ROUTES.UPLOAD_ATTACHMENT, data),
};
