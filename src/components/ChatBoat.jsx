import React, { useEffect, useState } from "react";
import { Phone, Video, MoreVertical, Paperclip, Send, Mic } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { messageService } from "../services/message.service";
import { conversationService } from "../services/conversation.service";
import { socket } from "../socket";
import { IoDocumentText } from "react-icons/io5";
import { BiSolidPhotoAlbum } from "react-icons/bi";
import { useRef } from "react";
import { attachmentService } from "../services/attachement.service";
import { RxCross2 } from "react-icons/rx";
import { ArrowLeft } from "lucide-react";


const ChatBoat = ({
  selectUser,
  fetchConversations,
  setSelectUser,
  activeConversationId,
  setActiveConversationId,
  setShowChat,
}) => {
  console.log("selectUser", selectUser);
  console.log("activeConversationId", activeConversationId);

  useEffect(() => {
    if (selectUser?.conversation_id) {
      setActiveConversationId(selectUser.conversation_id);
    }
  }, [selectUser]);

  const [messages, setMessages] = useState([]);
  console.log("messages", messages);

  const [messageData, setMessageData] = useState("");
  console.log("messageData", messageData);

  const [openAttachmentMenu, setOpenAttachmentMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversationGroupMembers, setConversationGroupMembers] = useState([]);

  //----------------------


  useEffect(() => {
  setMessages([]);
}, [selectUser]);


  const fileRef = useRef(null);
  const menuRef = useRef(null);
  const selectUserRef = useRef(selectUser);

  useEffect(() => {
    selectUserRef.current = selectUser;
  }, [selectUser]);

  //-------------

  const token = sessionStorage.getItem("token");
  const decoded = jwtDecode(token);
  const currentUserId = decoded.id || decoded.user_id;

  //--------------------------------

  const isConversation = selectUser?.ConversationMembers;

  const otherUser = isConversation
    ? selectUser?.ConversationMembers?.find((m) => m.user_id !== currentUserId)
      ?.User
    : selectUser;

  //------------

  useEffect(() => {
    setMessages([]);

    if (!selectUser?.conversation_id) return;

    const fetchMessages = async () => {
      const res = await messageService.getMessages(selectUser.conversation_id);
      setMessages(res?.data?.data || []);
    };

    fetchMessages();
  }, [selectUser?.conversation_id]);

  //-------------

  const sendMessage = async () => {
    try {
      if (!messageData.trim() && !selectedFile) return;

      let conversationId = selectUser?.conversation_id;

      if (!conversationId) {
        const res = await conversationService.createDirectConversation(
          selectUser.user_id,
        );
        conversationId = res.data.data.conversation_id;
      }

      const msgRes = await messageService.sendMessages({
        conversationId,
        message: messageData || "",
      });

      const message = msgRes.data.data;
      const messageId = message.message_id;

      let attachments = [];

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("senderId", currentUserId);
        formData.append("conversationId", conversationId);
        formData.append("messageId", messageId);

        const uploadRes = await attachmentService.uploadAttachment(formData);

        attachments = [uploadRes.data.data];
      }

      const finalMessage = {
        ...message,
        attachments,
      };

      socket.emit("send_message", finalMessage);

      setMessages((prev) => [...prev, finalMessage]);

      setMessageData("");

      setSelectedFile(null);

      await fetchConversations();
    } catch (err) {
      console.log(err);
    }
  };

  //------------

  const handleFileUpload = async (file) => {
    try {
      const conversationId = selectUser?.conversation_id;
      if (!conversationId || !file) return;

      const msgRes = await messageService.sendMessages({
        conversationId,
        message: "",
      });

      const message = msgRes.data.data;
      const messageId = message.message_id;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("senderId", currentUserId);
      formData.append("conversationId", conversationId);
      formData.append("messageId", messageId);

      const uploadRes = await attachmentService.uploadAttachment(formData);

      const finalMessage = {
        ...message,
        attachments: [uploadRes.data.data],
      };

      setMessages((prev) => [...prev, finalMessage]);

      socket.emit("send_message", finalMessage);

      setSelectedFile(null);
      // await fetchConversations();
    } catch (err) {
      console.log("Upload error:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setOpenAttachmentMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenAttachmentMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleAttachmentMenu = () => {
    setOpenAttachmentMenu((prev) => !prev);
  };

  const conversationId = selectUser?.conversation_id;

  //-------------------------------------

  const getGroupMembers = async () => {
    try {
      if (!conversationId) return;

      const res =
        await conversationService.getConversationGroupMembers(conversationId);

      setConversationGroupMembers(res.data.data.ConversationMembers || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!conversationId) return;

    getGroupMembers();
  }, [conversationId]);

  //------------------------------

  // MARK READ

  useEffect(() => {
    if (!activeConversationId) return;

    const markRead = async () => {
      await conversationService.markReads(activeConversationId);
      await fetchConversations();

      socket.emit("messages_read", {
        conversationId: activeConversationId,
        userId: currentUserId,
      });
    };

    markRead();
  }, [activeConversationId]);

  //------------------------------

  useEffect(() => {
    const handleMessage = async (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.message_id === msg.message_id)) return prev;
        return [...prev, msg];
      });

      if (
        msg.conversation_id === activeConversationId &&
        msg.sender_id !== currentUserId
      ) {
        await conversationService.markReads(activeConversationId);

        socket.emit("messages_read", {
          conversationId: activeConversationId,
          userId: currentUserId,
        });

        fetchConversations();
      }
    };

    socket.on("receive_message", handleMessage);

    return () => socket.off("receive_message", handleMessage);
  }, [activeConversationId, currentUserId]);

  //---------------------------

  useEffect(() => {
    const handleNewConversation = (msg) => {
      fetchConversations();
    };

    socket.on("new_conversation", handleNewConversation);

    return () => {
      socket.off("new_conversation", handleNewConversation);
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#efeae2]">
      {selectUser ? (
        <>
          <div
            className="h-16 bg-white border-b border-black/10 flex items-center justify-between px-3 sm:px-5"
          >

            <div className="flex items-center">
              <button
                onClick={() => setShowChat(false)}
                className="md:hidden mr-2 text-gray-600"
              >
                <ArrowLeft size={24} />
              </button>


              <div className="flex items-center gap-3">
                <img
                  src={
                    selectUser?.isGroup
                      ? selectUser.groupImage

                      || "https://cdn.vectorstock.com/i/500p/57/85/group-people-icon-vector-2855785.avif"
                      : otherUser?.image
                      ||
                      "https://chatapps-backend.onrender.com/uploads/1781081199448_user.jpg"
                  }
                  className="w-11 h-11 rounded-full"
                />

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectUser?.isGroup
                      ? selectUser.groupName
                      : isConversation
                        ? otherUser?.name
                        : selectUser?.name}
                  </h3>
                  <div className="text-xs text-gray-500">
                    <div className="text-xs text-gray-500">
                      {selectUser?.isGroup &&
                        selectUser?.ConversationMembers?.map((m) =>
                          m.User?.user_id === currentUserId
                            ? "You"
                            : m.User?.name,
                        ).join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-600">
              <button>
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 no-scrollbar overflow-y-auto p-5 space-y-4    ">
            {messages.map((msg) => {
              const sender = conversationGroupMembers.find(
                (m) => Number(m.user_id) === Number(msg.sender_id),
              );

              const isMe = msg.sender_id === currentUserId;

              const status = msg.status?.toLowerCase?.();

              return (
                <div
                  key={msg.message_id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl shadow-sm ${isMe
                      ? "bg-[#d9fdd3] rounded-br-md"
                      : "bg-white rounded-bl-md"
                      }`}
                  >
                    {selectUser?.isGroup && (
                      <div className="text-[12px] text-gray-500">
                        ~ {sender?.User?.name}
                      </div>
                    )}
                    <p className="text-gray-700 text-sm my-1">
                      {msg.message_text}
                    </p>
                    {msg.attachments?.map((att, i) => (
                      <div key={i}>
                        {att.fileType === "image" ? (
                          <img
                            className="w-40 rounded-lg shadow border border-black/10"
                            src={`https://chatapps-backend.onrender.com/uploads/${att.fileUrl}`}
                            alt=""
                          />
                        ) : (
                          <a
                            href={`https://chatapps-backend.onrender.com/uploads/${att.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 bg-white border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 w-fit max-w-xs"
                          >
                            <div className="text-2xl">📄</div>

                            <div className="flex flex-col">
                              <span className="text-sm text-gray-800 font-normal">
                                {att.fileName || "Document"}
                              </span>

                              <span className="text-xs text-gray-500">
                                Click to open
                              </span>
                            </div>
                          </a>
                        )}
                      </div>
                    ))}
                    <div className="text-right text-[10px] text-gray-500 mt-1 flex justify-end gap-1 items-center">
                      {status === "sent" && <span>✓</span>}
                      {status === "delivered" && <span>✓✓</span>}
                      {status === "seen" && (
                        <span className="text-blue-500">✓✓</span>
                      )}

                      {new Date(msg.sent_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-white border-t border-black/10 px-4 py-3 relative">
            <div className="flex items-center gap-3">
              <button className="text-gray-500 hover:text-green-600">
                <Paperclip onClick={toggleAttachmentMenu} size={22} />
              </button>

              {selectedFile && (
                <div
                  className="p-2 border border-black/20 rounded mb-2 bg-gray-50 flex 
              justify-between items-center"
                >
                  <span className="text-sm">{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)}>
                    <RxCross2 />
                  </button>
                </div>
              )}

              {openAttachmentMenu && (
                <div
                  ref={menuRef}
                  className="absolute bottom-16 left-3 bg-white shadow-lg rounded-xl p-3 w-44 space-y-3 border border-gray-200"
                >
                  <div
                    onClick={() => fileRef.current.click()}
                    className="flex gap-3 items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                  >
                    <IoDocumentText className="text-xl text-blue-500" />
                    <span className="text-sm">Document</span>
                  </div>

                  <div
                    onClick={() => fileRef.current.click()}
                    className="flex gap-3 items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                  >
                    <BiSolidPhotoAlbum className="text-xl text-pink-500" />
                    <span className="text-sm">Photos & Videos</span>
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileRef}
                hidden
                onChange={handleFileChange}
              />

              <input
                type="text"
                placeholder="Type a message..."
                value={messageData}
                onChange={(e) => setMessageData(e.target.value)}
                className="flex-1 bg-gray-100 rounded-full px-5 py-3 outline-none"
              />

              <button
                onClick={() => sendMessage()}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <img
            src="https://png.pngtree.com/png-vector/20221214/ourmid/pngtree-phone-chat-apps-png-image_6523592.png"
            className="w-64 opacity-80"
          />
          <p className="text-gray-500 mt-3">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
};

export default ChatBoat;
