import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // For accessing Redux state
import { logout } from "../redux/slice/authSlice"; // Importing logout action
import { useDispatch } from "react-redux"; // For dispatching actions

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get token from Redux state
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/cart/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCart(response.data.items);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch cart");
          setLoading(false);
          console.error("Failed to fetch cart:", err);
        });
    } else {
      setLoading(false);
      navigate("/login");
    }
  }, [token, navigate]);

  const handleDelete = (productId) => {
    if (token) {
      axios
        .delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart/remove`, {
          data: { userId: token, productId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setCart(cart.filter((item) => item.productId._id !== productId));
        })
        .catch((err) => {
          setError("Failed to delete item");
          console.error("Failed to delete item:", err);
        });
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    if (token) {
      axios
        .put(
          `${import.meta.env.VITE_BACKEND_URL}/api/cart/update`,
          { userId: token, productId, quantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setCart((prevCart) =>
            prevCart.map((item) =>
              item.productId._id === productId ? { ...item, quantity } : item
            )
          );
        })
        .catch((err) => {
          setError("Failed to update quantity");
          console.error("Failed to update quantity:", err);
        });
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="container min-h-screen mx-auto p-4 sm:p-12 mt-24 sm:mt-16"> {/* Adjusted padding for mobile */}
      <h1 className="text-center font-semibold text-2xl sm:text-3xl mb-4 sm:mb-6">Your Cart</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => {
            const product = item?.productId;
            const alternateMedicine =
              item?.productId?.alternateMedicines?.[0] || null;

            return (
              <div 
                key={index}
                className="flex flex-col sm:flex-row items-center border p-4 rounded-md"
              > {/* Changed to column layout on mobile */}
                <img
                  src={alternateMedicine?.manufacturerUrl || "placeholder.jpg"}
                  alt={alternateMedicine?.name || "Unnamed product"}
                  className="w-32 h-10 object-cover rounded mb-4 sm:mb-0 sm:mr-4" /* Added margin for spacing */
                />
                <div className="flex-1 text-center sm:text-left"> {/* Center text on mobile */}
                  <h2 className="font-bold text-lg">
                    {alternateMedicine?.name || "Unknown Product"}
                  </h2>
                  <p className="text-blue-600 font-semibold">
                    Price: Rs.{alternateMedicine?.price || "N/A"}
                  </p>
                  <div className="flex justify-center sm:justify-start items-center mt-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.productId._id,
                          item.quantity - 1
                        )
                      }
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-red-400"
                    >
                      -
                    </button>
                    <span className="px-4">{item?.quantity || 0}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.productId._id,
                          item.quantity + 1
                        )
                      }
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-green-400"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.productId._id)}
                  className="mt-4 sm:mt-0 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                > {/* Moved delete button below for mobile */}
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
      {cart.length > 0 && (
        <button
          onClick={handleCheckout}
          className="bg-green-500 text-white p-2 rounded mt-6 w-full sm:w-auto mx-auto block transition transform duration-300 ease-in-out hover:bg-green-600 hover:scale-105"
        > {/* Made button full width on mobile */}
          Checkout
        </button>
      )}
    </div>
  );
};

export default CartPage;
