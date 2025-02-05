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
          // console.log("Cart API Response:", response.data);
          setCart(response.data.items); // No need to filter, as backend returns only alternate medicines
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
    <div className="container min-h-screen mx-auto p-24">
      <h1 className="text-center text-3xl mb-6">Your Cart</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => {
            // Extract alternate medicine details (if available)
            const product = item?.productId;
            console.log(product);
            const alternateMedicine =
              item?.productId?.alternateMedicines?.[0] || null;

            return (
              <div 
                key={index}
                className="flex items-center border p-4 rounded-md"
              >
                <img
                  src={alternateMedicine?.manufacturerUrl || "placeholder.jpg"}
                  alt={alternateMedicine?.name || "Unnamed product"}
                  className="w-26 h-16 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <h2 className="font-bold text-lg">
                    {alternateMedicine?.name || "Unknown Product"}
                  </h2>
                  <p className="text-blue-600 font-semibold">
                    Price: Rs.{alternateMedicine?.price || "N/A"}
                  </p>
                  <div className="flex items-center mt-2">
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
                  className="ml-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
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
          className="bg-green-500 text-white p-2 rounded mt-6 block mx-auto transition transform duration-300 ease-in-out hover:bg-green-600 hover:scale-105"
        >
          Checkout
        </button>
      )}
    </div>
  );
};

export default CartPage;
