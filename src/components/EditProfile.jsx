import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { userProfileService } from "../services/profile.service";
import { FaCamera } from "react-icons/fa";

const EditProfile = ({ sidebarView, setSidebarView }) => {
  const token = sessionStorage.getItem("token");

  const [decodedId, setDecodedId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setDecodedId(decoded.id);
    }
  }, [token]);

  const fetchProfile = async () => {
    if (!decodedId) return;

    const res = await userProfileService.getProfile(decodedId);
    setProfileData(res.data);
  };

  useEffect(() => {
    fetchProfile();
  }, [decodedId]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);

      setProfileData({
        ...profileData,
        image: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", profileData.name);
      formData.append("about", profileData.about);
      formData.append("phoneNo", profileData.phoneNo);

      if (imageFile) {
        formData.append("file", imageFile);
      }

      const res = await userProfileService.updateProfile(decodedId, formData);

      alert("Profile Updated Successfully");

      await fetchProfile();

      setSidebarView("profile");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-4 space-y-5">
      <div className="flex items-center gap-3">
        <button className="text-lg" onClick={() => setSidebarView("profile")}>
          ←
        </button>

        <h1 className="text-[18px] font-semibold">Edit Profile</h1>
      </div>

      <div className="relative w-fit mx-auto">
        <img
          className="w-28 h-28 rounded-full object-cover border"
          src={
            profileData?.image
              ? profileData.image.startsWith("blob:")
                ? profileData.image
                : `http://localhost:5000/uploads/${profileData.image}`
              : "https://www.gravatar.com/avatar/?d=mp"
          }
        />

        <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow cursor-pointer">
          <FaCamera className="text-gray-600" />

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Name</label>

        <input
          name="name"
          className="w-full p-2 rounded  outline-none text-[14px]"
          value={profileData?.name || ""}
          onChange={handleChange}
          placeholder="Name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">About</label>

        <input
          name="about"
          className="w-full p-2 rounded  outline-none text-[14px]"
          value={profileData?.about || ""}
          onChange={handleChange}
          placeholder="About"
        />
      </div>

      {/* PHONE */}
      <div className="space-y-2">
        <label className="text-sm">Phone</label>

        <input
          name="phoneNo"
          className="w-full p-2 rounded  outline-none text-[14px]"
          value={profileData?.phoneNo || ""}
          onChange={handleChange}
          placeholder="Phone Number"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
