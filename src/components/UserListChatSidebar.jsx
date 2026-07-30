import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { userService } from "../services/user.service";
import { conversationService } from "../services/conversation.service";
import { formatTime } from "../utils/formateTime";
import { jwtDecode } from "jwt-decode";
import { socket } from "../socket";

const UserListChatSidebar = ({
  selectUser,
  setSelectUser,
  conversation,
  fetchConversations,
  setConversation,
  activeConversationId,
  setActiveConversationId,
}) => {
  //-------------------

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // -----------------

  const token = sessionStorage.getItem("token");

  let currentUserId = null;

  if (token) {
    const decoded = jwtDecode(token);
    currentUserId = decoded.id || decoded.user_id;
  }

  //----------------------------

  const filteredChats = conversation.filter((chat) => {
    const otherUser = chat.ConversationMembers?.find(
      (m) => m.user_id !== currentUserId,
    )?.User;

    const name = chat.isGroup ? chat.groupName : otherUser?.name;

    return name?.toLowerCase().includes(search.toLowerCase());
  });

  //----------------------------

  const fetchUsers = async () => {
    try {
      const res = await userService.searchUser(search);
      setUsers(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setUsers([]);
      return;
    }

    const delay = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const existingUserIds = conversation
    .filter((chat) => !chat.isGroup)
    .flatMap((chat) => chat.ConversationMembers?.map((m) => m.user_id))
    .filter((id) => id !== currentUserId)
    .map(Number);

  //----------------

  const filteredUsers = users.filter(
    (user) => !existingUserIds.includes(Number(user.user_id)),
  );

  useEffect(() => {
    if (selectUser) {
      setSearch("");
    }
  }, [selectUser]);

  useEffect(() => {
    fetchConversations();
  }, []);

  // ------------------------------------

  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      setConversation((prev) => {
        return prev.map((chat) => {
          if (chat.conversation_id !== msg.conversation_id) return chat;

          return {
            ...chat,
            lastMessage: msg,
            lastMessageAt: msg.sent_at,
          };
        });
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [selectUser]);

  useEffect(() => {
    const handleNewConversation = (msg) => {
      fetchConversations();
    };

    socket.on("new_conversation", handleNewConversation);

    return () => {
      socket.off("new_conversation", handleNewConversation);
    };
  }, []);

  useEffect(() => {
    if (!conversation.length) return;

    conversation.forEach((chat) => {
      socket.emit("join_room", chat.conversation_id);
    });
  }, [conversation]);

  //------------------------

  useEffect(() => {
    const handleMessagesRead = ({ conversationId }) => {
      setConversation((prev) =>
        prev.map((chat) =>
          chat.conversation_id === conversationId
            ? { ...chat, unread_count: 0 }
            : chat,
        ),
      );
    };

    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("messages_read", handleMessagesRead);
    };
  }, []);

  return (
    <div className=" bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none px-3 w-full text-sm"
          />
        </div>
      </div>

      {!search && conversation.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
            className="w-24 h-24 opacity-50"
          />

          <h3 className="mt-4 font-semibold text-gray-700">No chats yet</h3>

          <p className="text-sm text-gray-500 mt-2">
            Search for someone to start a conversation
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {!search &&
          [...conversation]
            .sort(
              (a, b) =>
                new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0),
            )
            .map((chat) => {
              const otherUser = chat.ConversationMembers?.map(
                (m) => m.User,
              )?.find((u) => u?.user_id !== currentUserId);

              // console.log("ChatData", chat);

              return (
                <div
                  key={chat.conversation_id}
                  onClick={() => {
                    setSelectUser(chat);
                    setActiveConversationId(chat.conversation_id);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={
                      chat.isGroup
                        ? chat.groupImage
                        ||
                        "https://static.vecteezy.com/system/resources/thumbnails/078/631/000/small/minimalist-flat-teamwork-staff-group-user-community-people-icon-vector.jpg"
                        : otherUser?.image
                        ||
                        "https://chatapps-backend.onrender.com/uploads/1781081199448_user.jpg"
                    }
                    className=" rounded-full object-cover border border-black/10 w-12 h-12"
                  />

                  <div className="flex-1">
                    <h4 className="font-medium flex items-center gap-2 w-full">
                      {chat.isGroup ? chat.groupName : otherUser?.name}

                      {chat.unread_count > 0 && (
                        <div
                          className="flex justify-center items-center bg-green-500 text-white 
                         rounded-full w-5 h-5 text-xs "
                        >
                          <span>{chat.unread_count}</span>
                        </div>
                      )}
                    </h4>

                    <p
                      className=" text-[11px] text-gray-500 
                   "
                    >
                      {chat.lastMessage?.message_text || "No messages yet"}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400">
                    {formatTime(chat.lastMessageAt)}
                  </span>
                </div>
              );
            })}

        {search && (
          <>
            {filteredChats.length > 0 && (
              <p className="px-4 py-2 text-xs text-gray-400">CHATS</p>
            )}

            {filteredChats.map((chat) => {
              const otherUser = chat.ConversationMembers?.find(
                (m) => m.user_id !== currentUserId,
              )?.User;

              console.log("otherUser", otherUser?.name);

              return (
                <div
                  key={chat.conversation_id}
                  onClick={() => setSelectUser(chat)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={
                      chat.isGroup
                        ? chat.groupImage
                        ||
                        "https://cdn.vectorstock.com/i/500p/57/85/group-people-icon-vector-2855785.avif"
                        : otherUser?.image
                        ||
                        "https://chatapps-backend.onrender.com/uploads/1781081199448_user.jpg"
                    }
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <h4 className="font-medium">
                      {chat.isGroup ? chat.groupName : otherUser?.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {chat.lastMessage?.message_text}
                    </p>
                  </div>
                </div>
              );
            })}

            {filteredUsers.length > 0 && (
              <p className="px-4 py-2 text-xs text-gray-400 mt-2">PEOPLE</p>
            )}

            {filteredUsers.map((user) => (
              <div
                key={user.user_id}
                onClick={() => setSelectUser(user)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
              >
                <img
                  src={
                    user.image

                    || "https://chatapps-backend.onrender.com/uploads/1781258996563_user.jpg"
                  }
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <h4 className="font-medium">{user.name}</h4>
                  <p className="text-xs text-gray-500">Start chat</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200"></div>
    </div>
  );
};

export default UserListChatSidebar;
