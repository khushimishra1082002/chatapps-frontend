import React, { useState } from "react";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="hidden md:block">
        <img
          className="w-full h-full object-cover"
          src="https://static.vecteezy.com/system/resources/previews/007/166/547/non_2x/3d-chat-application-logo-background-social-media-free-vector.jpg"
          alt="auth visual"
        />
      </div>

      <div className="flex justify-center items-center ">
        <div className=" p-8 rounded-2xl w-96 shadow ">
          {showBack && (
            <button
              onClick={() => {
                setShowBack(false);
                window.location.reload();
              }}
              className="mb-4 text-sm text-gray-600 hover:text-black cursor-pointer"
            >
              ← Back
            </button>
          )}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold">
              {isSignup ? "Create Your Account" : "Welcome Back"}
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              {isSignup
                ? "Join us and start chatting instantly"
                : "Login to continue your conversations"}
            </p>
          </div>

          {isSignup ? (
            <Signup isSignup={isSignup} setIsSignup={setIsSignup} />
          ) : (
            <Login
              isSignup={isSignup}
              setIsSignup={setIsSignup}
              setShowBack={setShowBack}
            />
          )}

          <p className="text-sm text-center mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}

            <button
              className="text-blue-500 ml-1 font-medium cursor-pointer scale-110 duration-700"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Login" : "Signup"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
