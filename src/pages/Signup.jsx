import React, { useState } from "react";
import { authService } from "../services/auth.service";
import { validateSignup } from "../validations/signupValidations";
import { Eye, EyeOff } from "lucide-react";


const Signup = ({ isSignup, setIsSignup }) => {

  const [showPassword, setShowPassword] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    phoneNo: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateSignup(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("phoneNo", formData.phoneNo);

    if (formData.image) {
      data.append("file", formData.image);
    }


    try {
      const res = await authService.signup(data);

      console.log("Data", res);

      const message = res?.data?.message || "Signup successful";

      alert(message);

      setIsSignup(false);
    } catch (err) {
      console.log(err);
      const message = err?.response?.data?.message || "Signup failed";
      console.log("Signup error:", err.response?.data);
      console.log("Status:", err.response?.status);
      alert(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="name"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="border border-black/10 p-2 rounded-sm focus:outline-none 
        focus:ring-2 focus:ring-blue-400 text-sm"
      />
      {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border border-black/10 p-2 rounded-sm focus:outline-none focus:ring-2
         focus:ring-blue-400 text-sm"
      />
      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border border-black/10 p-2 pr-10 rounded-sm focus:outline-none 
    focus:ring-2 focus:ring-blue-400 text-sm w-full"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 
    hover:text-gray-700 cursor-pointer"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>

      {errors.password && (
        <p className="text-red-500 text-xs">{errors.password}</p>
      )}


      <input
        type="number"
        name="phoneNo"
        placeholder="PhoneNo"
        value={formData.phoneNo}
        onChange={handleChange}
        className="border border-black/10 p-2 rounded-sm focus:outline-none focus:ring-2
         focus:ring-blue-400 text-sm"
      />
      {errors.phoneNo && (
        <p className="text-red-500 text-xs">{errors.phoneNo}</p>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Profile Image</label>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-50 file:text-blue-600
      hover:file:bg-blue-100 cursor-pointer"
        />
      </div>

      <button
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition
      cursor-pointer hover:scale-110 hover:duration-700"
      >
        Signup
      </button>
    </form>
  );
};

export default Signup;
