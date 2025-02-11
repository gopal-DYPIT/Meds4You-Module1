import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white py-10 px-2 sm:py-16 sm:ml-20">
      <div className="container mx-auto max-w-screen-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left px-4 sm:px-8">
        
        {/* Company Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Company</h3>
          <h1 className="text-2xl font-semibold text-gray-800">Mediforge LTD</h1>
          {/* <h2 className="text-gray-600 mt-2 text-md">Meds4You</h2> */}
          <ul className="space-y-2 mt-2 text-sm">
            <li className="text-gray-600 hover:text-blue-500 transition duration-300">
              <a href="#">Terms and Conditions</a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Us</h3>
          <p className="text-gray-600 text-sm">meds4you01@gmail.com</p>
          <p className="text-gray-600 text-sm font-semibold pt-2">+91 8484883367</p>
          <p className="text-gray-600 text-sm pt-2">Available 24/7</p>
        </div>

        {/* Join Us Section - Clickable */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Join Us</h3>
          <a href="/register/referral" className="text-gray-600 text-sm hover:text-blue-500 transition duration-300">
            Referral Program
          </a>
          <br />
          <a href="/register/partner" className="text-gray-600 text-sm hover:text-blue-500 transition duration-300">
            Affiliates/ Partners
          </a>
        </div>

        {/* Social Media Section - Clickable */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Follow Us On</h3>
          <div className="flex space-x-4 text-gray-600 text-2xl">
            {[
              { platform: "facebook", color: "hover:text-blue-500", link: "https://www.facebook.com/Meds4You" },
              { platform: "youtube", color: "hover:text-red-500", link: "https://www.youtube.com/Meds4You" },
              { platform: "instagram", color: "hover:text-pink-500", link: "https://www.instagram.com/Meds4You" },
              { platform: "twitter", color: "hover:text-blue-400", link: "https://x.com/Meds4You" },
            ].map((social, index) => (
              <a key={index} href={social.link} target="_blank" rel="noopener noreferrer" className={`${social.color} transition duration-300`}>
                <i className={`fab fa-${social.platform}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-gray-600 text-sm mt-10">
        <p>&copy; 2025 Meds4You. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
