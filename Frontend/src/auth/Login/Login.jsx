// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed. Please try again.");
      }

      // Dispatch login success and store token in localStorage
      dispatch(loginSuccess({ token: result.token }));
      localStorage.setItem("token", result.token);


      // console.log('Login successful:', result);
      if (result.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f3f4f6]">
      <div className="w-full sm:w-[500px] md:w-[600px] lg:w-[500px] h-[350px] bg-white p-10 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
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

          {/* Password Input */}
          <div className="mb-4 relative">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Your password"
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-400 text-white font-bold rounded-md hover:bg-indigo-500 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Not registered?{" "}
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

export default Login;
