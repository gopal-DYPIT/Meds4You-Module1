import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import axios from "axios";

const ManageReferrals = ({ userReferralCode }) => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from storage
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/users/referrals/${userReferralCode}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // Attach token
          }
        );

        setReferrals(response.data.referredUsers);
      } catch (error) {
        console.error(
          "Error fetching referrals",
          error.response?.data || error
        );
      } finally {
        setLoading(false);
      }
    };

    if (userReferralCode) {
      fetchReferrals();
    }
  }, [userReferralCode]);

  // Function to copy referral code to clipboard
  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2s
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const signupLink = `https://meds4you.in/register?referral=${userReferralCode}`;

  return (
    <div className="max-w-3xl mx-auto rounded-xl">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        My Referrals
      </h2>

      {/* Referral Code Section */}
      <div className="flex items-center justify-between p-2 border rounded-lg">
        <span className="text-sm font-semibold text-gray-800 bg-gray-200 px-3 py-1 rounded">
          {userReferralCode}
        </span>
        <button
          onClick={() => copyToClipboard(userReferralCode, setCopiedCode)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          {copiedCode ? <Check size={16} /> : <Copy size={16} />}
          {copiedCode ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Signup Link Section */}
      <div className="flex items-center gap-3 p-2 mt-4 border rounded-lg bg-white shadow-sm">
        <input
          type="text"
          value={signupLink}
          readOnly
          className="flex-1 text-sm text-gray-700 bg-gray-100 p-2 border rounded-md truncate"
        />
        <button
          onClick={() => copyToClipboard(signupLink, setCopiedLink)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
        >
          {copiedLink ? <Check size={16} /> : <Copy size={16} />}
          {copiedLink ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Referrals List */}
      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500 text-center">Loading referrals...</p>
        ) : referrals.length > 0 ? (
          <ul className="space-y-4">
            {referrals.map((user, index) => (
              <li
                key={index}
                className="p-4 rounded-lg bg-gray-50"
              >
                <p className="text-gray-900 font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Phone:</strong> {user.phoneNumber}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No referrals found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageReferrals;
