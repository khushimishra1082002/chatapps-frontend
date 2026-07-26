import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaArrowCircleRight } from "react-icons/fa";
import { userService } from "../services/user.service";

const AddGroupMember = ({
  setSidebarView,
  selectedUsersForGroup,
  setSelectedUsersForGroup,
}) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getAll();
        setUsers(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectUser = (user) => {
    const alreadySelected = selectedUsersForGroup.find(
      (u) => u.user_id === user.user_id,
    );

    if (alreadySelected) return;

    setSelectedUsersForGroup((prev) => [...prev, user]);
  };

  const handleRemoveUser = (user) => {
    const filteredUsers = selectedUsersForGroup.filter(
      (u) => u.user_id === user.user_id,
    );

    setSelectedUsersForGroup(filteredUsers);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-screen flex flex-col bg-white relative overflow-hidden">
      <div className="border-b border-black/10 p-4 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarView("chats")} className="text-xl">
            <RxCross2 />
          </button>

          <div>
            <h1 className="font-semibold text-lg">Add Group Members</h1>

            <p className="text-sm text-gray-500">
              {selectedUsersForGroup.length} selected
            </p>
          </div>
        </div>

        {selectedUsersForGroup.length > 0 && (
          <div className="flex gap-4 overflow-x-auto no-scrollbar mt-4 pb-2">
            {selectedUsersForGroup.map((user) => (
              <div
                key={user.user_id}
                className="flex flex-col items-center relative min-w-[65px]"
              >
                <img
                  className="w-12 h-12 rounded-full object-cover "
                  src={
                    user.image
                      ? `https://chatapps-backend.onrender.com/${user.image}`
                      : "https://www.gravatar.com/avatar/?d=mp"
                  }
                  alt={user.name}
                />

                <div className="text-xs mt-1 truncate text-center w-full ">
                  {user.name}
                </div>

                <button
                  onClick={() => handleRemoveUser(user.user_id)}
                  className="absolute top-0 right-0 bg-gray-700 text-white rounded-full p-1"
                >
                  <RxCross2 size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 rounded-full px-4 py-3 outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        {filteredUsers.map((user) => {
          const isSelected = selectedUsersForGroup.some(
            (u) => u.user_id === user.user_id,
          );

          return (
            <div
              key={user.user_id}
              onClick={() => handleSelectUser(user)}
              className={`p-3 rounded-xl cursor-pointer mb-1 transition-all
                ${isSelected ? "bg-green-100" : "hover:bg-gray-100"}
              `}
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={
                    user.image
                      ? `https://chatapps-backend.onrender.com/${user.image}`
                      : "https://www.gravatar.com/avatar/?d=mp"
                  }
                  alt={user.name}
                />

                <div>
                  <h2 className="font-medium">{user.name}</h2>

                  <p className="text-sm text-gray-500 line-clamp-1">
                    {user.about || "Hey there! I am using chat app."}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 mt-10">No users found</div>
        )}
      </div>

      {selectedUsersForGroup.length > 0 && (
        <button
          onClick={() => setSidebarView("createGroup")}
          className="absolute bottom-6 right-6 bg-green-500
           hover:bg-green-600 text-white p-3 rounded-full shadow-lg text-2xl transition-all
           cursor-pointer"
        >
          <FaArrowCircleRight />
        </button>
      )}
    </div>
  );
};

export default AddGroupMember;
