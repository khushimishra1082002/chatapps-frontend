import React from "react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { userProfileService } from "../services/profile.service";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdKey } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";

const Profile = ({ setSidebarView }) => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [decodedId, setDecodedId] = useState(null);
  const [profileData, setProfileData] = useState(null);

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

  const handleLogout = () => {
    alert("Logout Successfully");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div className="px-3">
        <div className="flex justify-center items-center py-6">
          <img
            className="w-24 h-24 rounded-full"
            src={
              profileData?.image
                ? `https://chatapps-backend.onrender.com/uploads/${profileData.image}`
                : "https://www.gravatar.com/avatar/?d=mp"
            }
          />
        </div>

        <div className="space-y-6">
          <div>
            <div
              onClick={() => setSidebarView("editProfile")}
              className="flex items-center gap-4 cursor-pointer"
            >
              <FaRegUserCircle className="text-xl text-gray-500" />
              <div className="flex flex-col">
                <h3 className="text-[16px]">Profile</h3>
                <span className="text-sm text-gray-500">
                  Name,Profile Photo
                </span>
              </div>
            </div>
          </div>

          <div>
            <Link>
              <div className="flex items-center gap-4 cursor-pointer">
                <IoMdKey className="text-2xl text-gray-500" />
                <div className="flex flex-col">
                  <h3 className="text-[16px]">Account</h3>
                  <span className="text-sm text-gray-500">
                    Security Notifiaction,Acccount Info
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4 cursor-pointer">
            <FaLock className="text-xl text-gray-500" />
            <div className="flex flex-col">
              <h3 className="text-[16px]">Privacy</h3>
              <span className="text-sm text-gray-500">Blocked contacts</span>
            </div>
          </div>

          <div className="flex items-center gap-4 cursor-pointer">
            <LuLogOut className="text-xl text-red-500" />
            <div className="flex flex-col">
              <h3 onClick={handleLogout} className="text-red-500 text-[16px]">
                Log out
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
