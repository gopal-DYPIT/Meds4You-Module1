import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/authSlice";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const CommonLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const attemptLogin = async (url) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  
    const textResponse = await response.text(); // Read response as text
    console.log("Raw response:", textResponse); // Debugging
  
    try {
      const result = JSON.parse(textResponse); // Try parsing as JSON
      if (!response.ok) {
        throw new Error(result.error || "Login failed.");
      }
      return result;
    } catch (jsonError) {
      throw new Error("Invalid JSON response from server.");
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;

      // First, try logging in as a partner
      try {
        result = await attemptLogin(`${import.meta.env.VITE_BACKEND_URL}/api/partners/login`);
      } catch (partnerError) {
        console.warn("Partner login failed, trying referral login...");
        // If partner login fails, try referral login
        result = await attemptLogin(`${import.meta.env.VITE_BACKEND_URL}/api/referrers/login`);
      }

      // Store token & userType in Redux
      dispatch(loginSuccess({ token: result.token, userType: result.userType }));

      // Save token & userType in local storage
      localStorage.setItem("token", result.token);
      localStorage.setItem("userType", result.userType);

      // Redirect based on userType
      if (result.userType === "partner") {
        navigate("/partner-dashboard");
      } else if (result.userType === "referral") {
        navigate("/referral-dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      toast.error(error.message, { position: "top-center", autoClose: 3000 });
    } finally {
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <div className="flex justify-center items-center bg-[#FFF0F5] pt-48 pb-36 sm:p-36 sm:pt-48 sm:pb-48">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white p-6 sm:p-10 rounded-lg shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your email"
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4 relative">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Your password"
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#48a8e3] text-white font-bold rounded-md hover:bg-[#565de3] transition"
          >
            Login
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CommonLogin;
