import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    storePartnerReferenceId: "",
    termsAccepted: false,
    earnings: 0,
    address: "", // Address field included but not used in signup
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.termsAccepted) {
      toast.error(
        "You must accept the Terms & Conditions",
        { position: "top-center" });
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      toast.error(
        "Passwords do not match!",
        { position: "top-center" });
      return;
    }
  
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error(
        "Phone number must be exactly 10 digits.",
        { position: "top-center" });
      return;
    }
    // Password validation: At least 8 characters, includes a number, uppercase, lowercase, and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        { position: "top-center" });
      return;
    }
  
    
    const { address, ...signupData } = formData;
  
    try {    
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Signup successful:", data);
        navigate("/login");
      } else {
        const error = await response.json();
        console.error("Signup error:", error);
        toast.error(
          error.message,
          { position: "top-center" });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  
  
  return (
    <div className="flex justify-center pt-10 items-center min-h-screen bg-[#FFF0F5] ">
      <div className="w-full sm:w-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

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

          {/* Phone Number Input */}
          <div className="mb-4 relative">
            <FaPhone className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Your phone number"
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="mb-4 flex space-x-2">
            <div className="relative w-1/2">
              <FaLock className="absolute left-3 top-3 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Your password"
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-3 cursor-pointer" onClick={togglePasswordVisibility}>
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </span>
            </div>

            <div className="relative w-1/2">
              <FaLock className="absolute left-3 top-3 text-gray-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter password"
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
               <span className="absolute right-3 top-3 cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </span>
            </div>
          </div>

          {/* Store Partner Reference ID (Optional) */}
          {/* <div className="mb-4 relative">
            <input
              type="text"
              name="storePartnerReferenceId"
              value={formData.storePartnerReferenceId}
              onChange={handleInputChange}
              placeholder="Store Partner Reference ID (Optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          {/* Terms & Conditions Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">
              I accept the {" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms & Conditions
              </a>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#FF007F] text-white font-bold rounded-md hover:bg-[#E60072] transition"
          >
            Sign Up
          </button>
        </form>

        {/* Already have an account */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-600 hover:underline"
              onClick={(e) => {
                e.preventDefault(); // Prevent default link behavior
                navigate("/login"); // Navigate to login page
              }}
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
