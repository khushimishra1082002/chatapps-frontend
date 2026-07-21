import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { userProfileService } from "../services/profile.service";
import { FaUserGroup } from "react-icons/fa6";

const Header = ({ setSidebarView }) => {
  const token = sessionStorage.getItem("token");

  const [decodedId, setDecodedId] = useState(null);

  const [profileData, setProfileData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setDecodedId(decoded.id);
    }
  }, [token]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!decodedId) return;
      try {
        const res = await userProfileService.getProfile(decodedId);
        setProfileData(res.data);
      } catch (err) {
        console.log("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, [decodedId]);

  return (
    <div className="flex items-center justify-between h-[10vh] bg-white border border-black/10 px-4">
      <Link to="/">
        <h1 className="font-bold text-2xl flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/134/134914.png"
            className="w-7 h-7"
          />
          ChatApp
        </h1>
      </Link>

      <div className="flex items-center gap-7">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setSidebarView("profile")}
        >
          <span className="text-sm font-medium">
            {profileData?.name || "User"}
          </span>
          <img
            className="w-8 h-8 rounded-full"
            src={
              profileData?.image
                ? `http://localhost:5000/uploads/${profileData.image}`
                : "https://www.gravatar.com/avatar/?d=mp"
            }
          />
        </div>

        <div>
          <span
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-xl cursor-pointer"
          >
            ⋮
          </span>
          {menuOpen && (
            <div
              onClick={() => setSidebarView("addGroupMember")}
              className="absolute right-4 mt-2 bg-white shadow-md rounded p-2 flex items-center gap-2 cursor-pointer"
            >
              <FaUserGroup />
              <div>
                <span className="text-sm">+ New Group</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
