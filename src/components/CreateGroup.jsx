import React, { useState, useEffect } from "react";
import { FaCamera, FaCheck } from "react-icons/fa";
import { conversationService } from "../services/conversation.service";
import { jwtDecode } from "jwt-decode";

const CreateGroup = ({ setSidebarView, members }) => {
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);

  const token = sessionStorage.getItem("token");

  const [decodedId, setDecodedId] = useState(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setDecodedId(decoded.id);
    }
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupImage(file);
    }
  };

  const CreateGroups = async () => {
    try {
      const formData = new FormData();

      formData.append("groupName", groupName);
      formData.append(
        "memberIds",
        JSON.stringify(members.map((u) => u.user_id)),
      );

      if (groupImage) {
        formData.append("file", groupImage);
      }

      const res = await conversationService.createGroupConversation(formData);

      console.log(res.data);

      alert("Group Created successfully");
      setSidebarView("chats");
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };
  return (
    <>
      <div className="space-y-2">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 cursor-pointer bg-white">
            <button
              className="text-lg"
              onClick={() => setSidebarView("profile")}
            >
              ←
            </button>

            <h1 className="text-[17px] font-semibold">New group</h1>
          </div>

          <div className="grid grid-cols-4 gap-3 items-center bg-white">
            <div className="relative">
              <img
                className="w-14 h-14 rounded-full object-cover border"
                src={
                  groupImage
                    ? URL.createObjectURL(groupImage)
                    : "https://www.gravatar.com/avatar/?d=mp"
                }
              />

              <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
                <FaCamera className="text-gray-600 text-xs" />

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="w-full col-span-3">
              <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name"
                className="w-full p-3 rounded-sm outline-none text-sm border border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 ">
          <div className="p-4">
            <h4 className="text-sm">Members : {members.length}</h4>

            <div className="grid grid-cols-3 gap-3 mt-3 overflow-y-auto no-scrollbar">
              {members.map((member) => (
                <div key={member.id} className="flex flex-col items-center">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={
                      member.image
                        ? `https://chatapps-backend.onrender.com/uploads/${member.image}`
                        : "https://www.gravatar.com/avatar/?d=mp"
                    }
                    alt={member.name}
                  />

                  <p className="text-xs mt-1">{member.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={CreateGroups}
          className="absolute bottom-2 left-56 bg-green-500
          hover:bg-green-600 text-white p-3 rounded-full
          shadow-lg text-2xl transition-all cursor-pointer"
        >
          <FaCheck className="text-xl" />
        </button>
      </div>
    </>
  );
};

export default CreateGroup;
