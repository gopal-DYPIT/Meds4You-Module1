import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white py-10 px-6 sm:py-16 sm:px-28 sm:ml-20">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
        {/* Left Section - Logo and Apps */}
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-gray-800">Meds4you</h1>
          <h2 className="text-gray-600 text-lg">Mediforge LTD</h2>
        </div>

        {/* Middle Section - Company Links */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <a href="/best-online-pharmacy" className="text-gray-600 hover:text-blue-500 text-sm transition duration-200">
                Best Online Pharmacy in India
              </a>
            </li>
            <li>
              <a href="/buy-medicines-online" className="text-gray-600 hover:text-blue-500 text-sm transition duration-200">
                Buy Medicines Online With Discount
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="text-gray-600 hover:text-blue-500 text-sm transition duration-200">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms-of-use" className="text-gray-600 hover:text-blue-500 text-sm transition duration-200">
                Terms of Use
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h3>
          <p className="text-gray-600 text-sm">meds4you01@gmail.com</p>
          <p className="text-gray-600 text-sm font-semibold pt-3">+91 8484883367</p>
          <p className="text-gray-600 text-sm pt-3">Available 24/7</p>
        </div>

        {/* Social Media Section - Left Aligned */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Follow us on</h3>
          <div className="flex flex-wrap gap-4 text-gray-600 text-2xl">
            <a href="https://www.facebook.com/Meds4You" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition duration-300">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://www.youtube.com/Meds4You" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition duration-300">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://www.instagram.com/Meds4You" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition duration-300">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://x.com/Meds4You" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-300">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Text - Left Aligned */}
      <div className="text-left text-gray-600 text-sm pt-10">
        <p>&copy; 2025 Meds4you. All Rights Reserved.</p>
      </div>  
    </footer>
  );
};

export default Footer;
