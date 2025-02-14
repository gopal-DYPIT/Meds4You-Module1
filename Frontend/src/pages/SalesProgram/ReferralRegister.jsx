import React, { useState } from "react";
import axios from "axios";
import FAQReferral from "./FAQ-Referral";
import ReCAPTCHA from "react-google-recaptcha";
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const ReferralRegister = () => {
  const [captchaValue, setCaptchaValue] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!captchaValue) {
      toast.error("Please complete the CAPTCHA verification", {
        position: "top-center",
      });
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits.", {
        position: "top-center",
      });
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        { position: "top-center" }
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/referrers/register`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }
      );

      setMessage(
        `Registration successful! Your referral code: ${response.data.referralCode}`
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Join Our Referral Program
          </h1>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Content */}
            <div>
              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  How It Works
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg text-gray-900">
                        Sign Up
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Fill out the form and get approved within a day.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg text-gray-900">
                        Promote
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Share your referral link via social media, blog, or
                        newsletter.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg text-gray-900">
                        Earn
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Get 10% on generic and 2% on branded drugs for each
                        sale.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <FAQReferral />
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Register
                </h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                {message && (
                  <p className="text-green-600 text-sm mb-3">{message}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  {/* CAPTCHA */}
                  <div className="mb-4 flex justify-center">
                    <ReCAPTCHA
                      sitekey={SITE_KEY}
                      onChange={handleCaptchaChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Join Program
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By joining, you agree to our Terms of Service and Privacy
                    Policy
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralRegister;
