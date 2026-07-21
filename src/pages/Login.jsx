import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { validatelogin } from "../validations/loginValidations";
import { socket } from "../socket";

const Login = ({ setShowBack }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState("choose");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    phoneNo: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendOtp = async () => {
    await authService.sendOTP({ phoneNo: formData.phoneNo });
    setStep("otp");
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.verifyOTP({
        phoneNo: formData.phoneNo,
        otp: formData.otp,
      });

      console.log("RESPONSE:", response);

      const token = response?.data?.token;
      const user = response?.data?.user;

      console.log("TOKEN:", token);
      console.log("USER:", user);

      if (token) {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));

        navigate("/home");
        console.log("TOKEN SAVED:", token);
      } else {
        alert("Login failed - token missing");
      }
    } catch (err) {
      console.log("ERROR:", err?.response?.data);
      alert(err?.response?.data?.message || "OTP failed");
    }
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

      alert(message);
    }
  };

  return (
    <div className="p-4">
      {step === "choose" && (
        <div className="grid grid-cols-1 gap-3">
          <button
            className="border border-blue-500/40 text-sm p-2 cursor-pointer"
            onClick={() => {
              setStep("email");
              setShowBack(true);
            }}
          >
            Login with Email
          </button>

          <button
            className="bg-red-500 text-white border border-black/10 
            rounded-sm text-sm p-2 cursor-pointer"
            onClick={() => {
              setStep("phone");
              setShowBack(true);
            }}
          >
            Login with Phone (OTP)
          </button>
        </div>
      )}

      {step === "email" && (
        <form className="flex flex-col gap-2">
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="border border-black/10 p-2 rounded-sm focus:outline-none focus:ring-2
          focus:ring-blue-400 text-sm"
          />

          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="border border-black/10 p-2 rounded-sm focus:outline-none focus:ring-2
         focus:ring-blue-400 text-sm"
          />

          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}

          <button
            onClick={handleLogin}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition
             cursor-pointer hover:scale-105 hover:duration-700"
          >
            Login
          </button>
        </form>
      )}

      {step === "phone" && (
        <div className="flex flex-col gap-2">
          <input
            name="phoneNo"
            placeholder="Phone Number"
            onChange={handleChange}
            className="border border-black/10 p-2 rounded-sm focus:outline-none focus:ring-2
           focus:ring-blue-400 text-sm"
          />

          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition
             cursor-pointer hover:scale-105 hover:duration-700 text-sm"
            onClick={sendOtp}
          >
            Send OTP
          </button>
        </div>
      )}

      {step === "otp" && (
        <form onSubmit={verifyOtp} className="flex flex-col gap-2">
          <input
            name="otp"
            placeholder="Enter OTP"
            onChange={handleChange}
            className="border border-black/10 p-2 rounded-sm focus:outline-none focus:ring-2
           focus:ring-blue-400 text-sm"
          />

          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition
             cursor-pointer hover:scale-105 hover:duration-700 text-sm"
            type="submit"
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
