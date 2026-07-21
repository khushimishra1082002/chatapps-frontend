import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatBoat from "../components/ChatBoat";
import { socket } from "../socket";
import { conversationService } from "../services/conversation.service";

const Home = () => {
  const [sidebarView, setSidebarView] = useState("chats");
  const [selectedUsersForGroup, setSelectedUsersForGroup] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState();

  const fetchConversations = async () => {
    const res = await conversationService.getConversation();
    setConversation(res.data.data);

    console.log("Conversations API:", res.data.data);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="sticky top-0 z-50">
        <Header setSidebarView={setSidebarView} />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 border-r border-gray-200 overflow-y-auto no-scrollbar">
          <Sidebar
            conversation={conversation}
            fetchConversations={fetchConversations}
            setConversation={setConversation}
            selectUser={selectUser}
            setSelectUser={setSelectUser}
            sidebarView={sidebarView}
            setSidebarView={setSidebarView}
            selectedUsersForGroup={selectedUsersForGroup}
            setSelectedUsersForGroup={setSelectedUsersForGroup}
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
          />
        </aside>

        <main className="flex-1 overflow-y-auto">
          <ChatBoat
            fetchConversations={fetchConversations}
            selectUser={selectUser}
            setSelectUser={setSelectUser}
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
          />
        </main>
      </div>
    </div>
  );
};

export default Home;
