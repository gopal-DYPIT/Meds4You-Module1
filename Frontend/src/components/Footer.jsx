import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white py-12 sm:py-24 p-6 sm:p-24">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-8">
        {/* Left Section - Logo and Apps */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Meds4you</h1>
            <h2 className="text-gray-600 text-lg pt-4 pl-1">Mediforge LTD</h2>
          </div>
        </div>

        {/* Middle Section - Company Links */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/best-online-pharmacy"
                className="text-gray-600 hover:text-blue-500 text-sm transition duration-200"
              >
                Best Online Pharmacy in India
              </a>
            </li>
            <li>
              <a
                href="/buy-medicines-online"
                className="text-gray-600 hover:text-blue-500 text-sm transition duration-200"
              >
                Buy Medicines Online With Discount
              </a>
            </li>
            <li>
              <a
                href="/privacy-policy"
                className="text-gray-600 hover:text-blue-500 text-sm transition duration-200"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms-of-use"
                className="text-gray-600 hover:text-blue-500 text-sm transition duration-200"
              >
                Terms of Use
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Contact Us
          </h3>
          <h2 className="text-gray-600 text-sm">meds4you01@gmail.com</h2>
          <h2 className="text-gray-600 text-sm font-semibold pt-3">
            +91 8484883367
          </h2>
          <h2 className="text-gray-600 text-sm pt-3">Available 24/7</h2>
        </div>

        {/* Social Media Section - Proper Alignment */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Follow us on
          </h3>
          <div className="flex space-x-6 text-gray-600 text-3xl">
            <a
              href="https://www.facebook.com/Meds4You"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition duration-300"
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="https://www.youtube.com/Meds4You"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition duration-300"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://www.instagram.com/Meds4You"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition duration-300"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://x.com/Meds4You"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition duration-300"
            >
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-gray-600 text-sm pt-16">
        <p>&copy; 2025 Meds4you. All Rights Reserved.</p>
      </div>  
    </footer>
  );
};

export default Footer;
