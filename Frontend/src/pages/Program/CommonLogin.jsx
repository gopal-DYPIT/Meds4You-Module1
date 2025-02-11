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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/partners/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Login failed. Please try again.");
      }
  
      // Store token in Redux
      dispatch(
        loginSuccess({
          token: result.token,
          userType: result.userType, // Store user type
        })
      );
  
      // Save token in local storage
      localStorage.setItem("token", result.token);
      localStorage.setItem("userType", result.userType); // Save user type
  
      // Redirect based on userType
      if (result.userType === "partner") {
        navigate("/partner-dashboard");
      } else if (result.userType === "referral") {
        navigate("/referral-dashboard");
      } else {
        navigate("/"); // Fallback route
      }
  
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setFormData({ email: "", password: "" });
    }
  };
  

  return (
    <div className="flex justify-center items-center bg-[#FFF0F5] pt-48 pb-36 sm:p-36 sm:pt-48 sm:pb-48"> {/* Removed min-h-screen */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white p-6 sm:p-10 rounded-lg shadow-xl"> {/* Adjusted width & padding */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-800"> {/* Adjusted text size */}
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
            className="w-full py-3 bg-[#FF007F] text-white font-bold rounded-md hover:bg-[#E60072] transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Not registered? {" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CommonLogin;
