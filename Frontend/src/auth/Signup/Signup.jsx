import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

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
      alert("You must accept the Terms & Conditions");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { address, ...signupData } = formData; // Exclude address from signup request

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
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
        alert(error.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="flex justify-center pt-10 items-center min-h-screen bg-[#f3f4f6]">
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
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Your password"
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative w-1/2">
              <FaLock className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter password"
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
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
            className="w-full py-3 bg-indigo-400 text-white font-bold rounded-md hover:bg-indigo-500 transition"
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
