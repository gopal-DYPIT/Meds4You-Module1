import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/authSlice";

const CommonLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("user");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let apiUrl;
    switch (loginType) {
      case "partner":
        apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/partners/login`;
        break;
      case "admin":
        apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`;
        break;
      default:
        apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Login failed");
      
      // Handle partner response which uses userType instead of role
      const userRole = loginType === "partner" 
        ? result.userType 
        : (result.role || "user");

      // Validate that the user role matches the selected login type
      if (userRole !== loginType) {
        throw new Error(`Invalid credentials for ${loginType} login. Please use correct credentials.`);
      }

      // For partner login, use the userType from response
      dispatch(loginSuccess({ 
        token: result.token, 
        userType: loginType === "partner" ? result.userType : (result.role || loginType)
      }));

      localStorage.setItem("token", result.token);
      localStorage.setItem("userType", loginType === "partner" ? result.userType : (result.role || loginType));

      // Navigate based on validated role
      if (userRole === "admin") navigate("/admin");
      else if (userRole === "partner") navigate("/partner-dashboard");
      else navigate("/");
      
      toast.success(`Successfully logged in as ${loginType}`, { 
        position: "top-center", 
        autoClose: 3000 
      });

    } catch (error) {
      toast.error(error.message, { position: "top-center", autoClose: 3000 });
    } finally {
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Please sign in to your account</p>
          </div>

          <div className="bg-gray-50 p-1 rounded-lg">
            <div className="grid grid-cols-3 gap-2">
              {["User", "Admin", "Partner"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setLoginType(type.toLowerCase());
                    setFormData({ email: "", password: "" });
                  }}
                  className={`py-2 text-sm font-medium rounded-md transition-all ${
                    loginType === type.toLowerCase()
                      ? "bg-white shadow text-blue-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter ${loginType}'s email`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter ${loginType}'s password`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Sign in as {loginType}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommonLogin;