import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatBoat from "../components/ChatBoat";
import { socket } from "../socket";
import { conversationService } from "../services/conversation.service";
import { ArrowLeft } from "lucide-react";

const Home = () => {
  const [sidebarView, setSidebarView] = useState("chats");
  const [selectedUsersForGroup, setSelectedUsersForGroup] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState();
  const [showChat, setShowChat] = useState(false);


  const fetchConversations = async () => {
    const res = await conversationService.getConversation();
    setConversation(res.data.data);

    console.log("Conversations API:", res.data.data);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header
  className={`
    sticky top-0 z-50
    ${showChat ? "hidden md:block" : "block"}
  `}
>
  <Header
    setSidebarView={setSidebarView}
    showChat={showChat}
  />
</header>





      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`
      ${showChat ? "hidden" : "block"}
      md:block
      w-full md:w-80
      border-r border-gray-200
      overflow-y-auto
      bg-white
    `}
        >
          <Sidebar
            conversation={conversation}
            fetchConversations={fetchConversations}
            setConversation={setConversation}
            selectUser={selectUser}
            setSelectUser={(user) => {
              setSelectUser(user);
              setShowChat(true); // Open chat on mobile
            }}
            sidebarView={sidebarView}
            setSidebarView={setSidebarView}
            selectedUsersForGroup={selectedUsersForGroup}
            setSelectedUsersForGroup={setSelectedUsersForGroup}
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
          />
        </aside>

        {/* Chat */}
        <main
          className={`
      ${showChat ? "block" : "hidden"}
      md:block
      flex-1
      overflow-hidden
    `}
        >
          <ChatBoat
            fetchConversations={fetchConversations}
            selectUser={selectUser}
            setSelectUser={setSelectUser}
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
            setShowChat={setShowChat}
          />
        </main>
      </div>

    </div>
  );
};

export default Home;
