import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { validatelogin } from "../validations/loginValidations";

const Login = ({ setShowBack }) => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = validatelogin(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      const token = res.data?.token;
      const user = res.data?.user;

      console.log("USER:", user.user_id);

      if (token) {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate("/home");
        console.log("TOKEN SAVED:", token);
      } else {
        alert(data?.message || "Login failed");
      }
    } catch (err) {
      console.log(err);
      console.log("Signup error:", error.response?.data);
      console.log("Status:", error.response?.status);
      const message =
        err?.response?.data?.message || "Invalid email or password";

      alert(message);
    }
  };


  return (
    <div className="p-4">
      <form className="flex flex-col gap-2">
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border border-black/10 p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />

        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email}</p>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="border border-black/10 p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />

        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password}</p>
        )}

        <button
          onClick={handleLogin}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition cursor-pointer hover:scale-105 hover:duration-700"
        >
          Login
        </button>
      </form>
    </div>
  );

};

export default Login;
