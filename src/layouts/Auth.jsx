import React, { useState } from "react";
import Signup from "../pages/Signup";
import Login from "../pages/Login";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showBack, setShowBack] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
     
      <div className="hidden md:block h-screen">
        <img
          className="w-full h-full object-cover"
          src="https://static.vecteezy.com/system/resources/previews/007/166/547/non_2x/3d-chat-application-logo-background-social-media-free-vector.jpg"
          alt="auth visual"
        />
      </div>

      
      <div className="h-screen overflow-y-auto ">
        <div className="min-h-full flex justify-center items-center py-8 px-4">
          <div className="w-full max-w-sm rounded-2xl shadow-lg p-8">
            {showBack && (
              <button
                onClick={() => {
                  setShowBack(false);
                  window.location.reload();
                }}
                className="mb-4 text-sm text-gray-600 hover:text-black"
              >
                ← Back
              </button>
            )}

            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold">
                {isSignup ? "Create Your Account" : "Welcome Back"}
              </h1>

              <p className="text-gray-500 text-sm mt-2">
                {isSignup
                  ? "Join us and start chatting instantly"
                  : "Login to continue your conversations"}
              </p>
            </div>

            {isSignup ? (
              <Signup
                isSignup={isSignup}
                setIsSignup={setIsSignup}
              />
            ) : (
              <Login
                isSignup={isSignup}
                setIsSignup={setIsSignup}
                setShowBack={setShowBack}
              />
            )}

            <p className="text-sm text-center mt-6">
              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}

              <button
                onClick={() => setIsSignup(!isSignup)}
                className="ml-2 text-blue-600 font-medium hover:underline"
              >
                {isSignup ? "Login" : "Signup"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
