import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { validatelogin } from "../validations/loginValidations";
import { Eye, EyeOff } from "lucide-react";


const Login = ({ setShowBack }) => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
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

      const message =
        err?.response?.data?.message || "Invalid email or password";

      if (message === "User not found") {
        setErrors({
          email: "Email does not exist",
        });
      }
      else if (message === "Invalid password") {
        setErrors({
          password: "Wrong password",
        });
      }
      else {
        setErrors({
          email: message,
        });
      }
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

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            className="w-full border border-black/10 p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm pr-10"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

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
