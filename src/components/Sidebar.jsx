import React from "react";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import AddGroupMember from "./AddGroupMember";
import CreateGroup from "./CreateGroup";
import UserListChatSidebar from "./UserListChatSidebar";

const Sidebar = ({
  selectUser,
  setSelectUser,
  sidebarView,
  setSidebarView,
  selectedUsersForGroup,
  setSelectedUsersForGroup,
  conversation,
  fetchConversations,
  setConversation,
  activeConversationId,
  setActiveConversationId,
}) => {
  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar">
      {sidebarView === "profile" && (
        <button
          className="p-2 text-left cursor-pointer "
          onClick={() => setSidebarView("chats")}
        >
          ←
        </button>
      )}

      {sidebarView === "chats" && (
        <UserListChatSidebar
          fetchConversations={fetchConversations}
          conversation={conversation}
          setConversation={setConversation}
          selectUser={selectUser}
          setSelectUser={setSelectUser}
          activeConversationId={activeConversationId}
          setActiveConversationId={setActiveConversationId}
        />
      )}

      {sidebarView === "profile" && <Profile setSidebarView={setSidebarView} />}

      {sidebarView === "editProfile" && (
        <EditProfile
          sidebarView={sidebarView}
          setSidebarView={setSidebarView}
        />
      )}

      {sidebarView === "addGroupMember" && (
        <AddGroupMember
          sidebarView={sidebarView}
          setSidebarView={setSidebarView}
          selectedUsersForGroup={selectedUsersForGroup}
          setSelectedUsersForGroup={setSelectedUsersForGroup}
        />
      )}

      {sidebarView === "createGroup" && (
        <CreateGroup
          sidebarView={sidebarView}
          setSidebarView={setSidebarView}
          members={selectedUsersForGroup}
        />
      )}
    </div>
  );
};

export default Sidebar;
