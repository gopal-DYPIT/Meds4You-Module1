import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedicines, setSelectedMedicines] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        .catch(() => {
          setError("Failed to fetch cart");
          setLoading(false);
        });
    } else {
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
          // Also remove from selected medicines
          const { [productId]: removed, ...rest } = selectedMedicines;
          setSelectedMedicines(rest);
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

  const handleSelectionChange = (productId, isChecked, isRecommended = false) => {
    setSelectedMedicines((prev) => ({
      ...prev,
      [productId]: isChecked ? (isRecommended ? 'recommended' : 'original') : null,
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const selectionType = selectedMedicines[item.productId._id];
      if (!selectionType) return total;

      if (selectionType === 'original') {
        return total + item.productId.price * item.quantity;
      } else if (selectionType === 'recommended' && item.productId.alternateMedicines?.[0]) {
        return total + item.productId.alternateMedicines[0].price * item.quantity;
      }
      return total;
    }, 0).toFixed(2);
  };

  const handleCheckout = () => {
    const selectedProducts = cart.map(item => ({
      ...item,
      isRecommended: selectedMedicines[item.productId._id] === 'recommended'
    })).filter(item => selectedMedicines[item.productId._id]);
    
    navigate("/checkout", { 
      state: { 
        selectedProducts,
        total: calculateTotal()
      } 
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-10 px-4 pt-28">
      <div className="max-w-8xl mr-6 ml-6">
        <h1 className="text-3xl ml-3 font-semibold text-gray-800 mb-12">
          Your Cart
        </h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-3 text-left">No.</th>
                    <th
                      colSpan="6"
                      className="py-2 px-3 text-left border-r border-gray-200"
                    >
                      Selected Medicine
                    </th>
                    <th colSpan="5" className="py-2 px-6 text-left">
                      Recommended Medicine
                    </th>
                  </tr>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-3 text-left">Sr.no.</th>
                    <th className="py-3 px-5 text-left">Name</th>
                    <th className="py-3 px-5 text-left">Manufacturer</th>
                    <th className="py-3 px-5 text-left">Price/Unit (Rs.)</th>
                    <th className="py-3 px-6 text-left">Quantity</th>
                    <th className="py-3 px-5 text-left ">Total (Rs.)</th>
                    <th className="py-3 px-5 text-left border-r border-gray-200">
                    Action
                    </th>
                    <th className="py-3 px-8 text-left ">Name</th>
                    <th className="py-3 px-5 text-left">Manufacturer</th>
                    <th className="py-3 px-5 text-left">Quantity</th>
                    <th className="py-3 px-5 text-left">Price/Unit (Rs.)</th>
                    <th className="py-3 px-5 text-left">Total (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => {
                    const product = item?.productId;
                    const alternate = product?.alternateMedicines?.[0];
                    const selection = selectedMedicines[product._id];
                    const isOriginalSelected = selection === 'original';
                    const isRecommendedSelected = selection === 'recommended';

                    return (
                      <tr key={item.id} className="border-t border-gray-200">
                        <td className="py-2 px-4 text-[16px]">{index + 1}</td>

                        {/* Selected Medicine Side */}
                        <td
                          className={`py-2 px-6 ${
                            isOriginalSelected ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div>
                              <input
                                type="radio"
                                name={`medicine-${product._id}`}
                                onChange={(e) =>
                                  handleSelectionChange(
                                    product._id,
                                    e.target.checked,
                                    false
                                  )
                                }
                                checked={isOriginalSelected}
                              />
                            </div>
                            <div>
                              <div className="text-[16px] text-gray-900">
                                {product?.drugName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          className={`py-2 px-6 text-[16px] ${
                            isOriginalSelected ? "bg-blue-50" : ""
                          }`}
                        >
                          {product?.manufacturer}
                        </td>
                        <td
                          className={`py-2 px-6 text-[16px] ${
                            isOriginalSelected ? "bg-blue-50" : ""
                          }`}
                        >
                          {product?.price}
                        </td>
                        <td
                          className={`py-2 px-2 text-[16px] ${
                            isOriginalSelected ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-center space-x-3 rounded-lg px-2 py-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  product._id,
                                  item.quantity - 1
                                )
                              }
                              className="flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-700 rounded-full hover:bg-red-500 hover:text-white transition-all"
                              aria-label="Decrease quantity"
                            >
                              <span className="text-xs font-semibold">−</span>
                            </button>

                            <span className="text-xs font-medium text-gray-600">
                              <span className="text-gray-900 font-semibold pl-0">
                                {item?.quantity || 0}
                              </span>
                            </span>

                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  product._id,
                                  item.quantity + 1
                                )
                              }
                              className="flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-700 rounded-full hover:bg-green-500 hover:text-white transition-all"
                              aria-label="Increase quantity"
                            >
                              <span className="text-xs font-semibold">+</span>
                            </button>
                          </div>
                        </td>
                        <td
                          className={`py-2 px-3 text-[16px] ${
                            isOriginalSelected ? "bg-blue-50" : ""
                          }`}
                        >
                          {(product?.price * item.quantity).toFixed(2)}
                        </td>

                        <td
                          className={`py-2 px-4 border-r border-gray-200 text-[16px] ${
                            isOriginalSelected ? "bg-blue-50" : ""
                          }`}
                        >
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-500 font-semibold hover:text-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </td>

                        {/* Alternative Medicine Side */}
                        {alternate ? (
                          <>
                            <td
                              className={`py-2 px-6 text-[16px] ${
                                isRecommendedSelected ? "bg-green-50" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div>
                                  <input
                                    type="radio"
                                    name={`medicine-${product._id}`}
                                    onChange={(e) =>
                                      handleSelectionChange(
                                        product._id,
                                        e.target.checked,
                                        true
                                      )
                                    }
                                    checked={isRecommendedSelected}
                                  />
                                </div>
                                <div className="font-medium text-gray-900">
                                  {alternate.name}
                                </div>
                              </div>
                            </td>
                            <td
                              className={`py-2 px-10 text-[16px] ${
                                isRecommendedSelected ? "bg-green-50" : ""
                              }`}
                            >
                              <img
                                src={alternate.manufacturerUrl}
                                alt="Manufacturer"
                                className="h-12 w-12 object-contain"
                              />
                            </td>
                            <td
                              className={`py-2 px-10 text-[16px] ${
                                isRecommendedSelected ? "bg-green-50" : ""
                              }`}
                            >
                              {item.quantity}
                            </td>
                            <td
                              className={`py-2 px-6 text-[16px] ${
                                isRecommendedSelected ? "bg-green-50" : ""
                              }`}
                            >
                              {alternate.price}
                            </td>
                            <td
                              className={`py-2 px-6 text-[16px] ${
                                isRecommendedSelected ? "bg-green-50" : ""
                              }`}
                            >
                              {(alternate.price * item.quantity).toFixed(2)}
                            </td>
                          </>
                        ) : (
                          <td
                            colSpan="5"
                            className="py-2 px-3 text-center text-gray-500"
                          >
                            No alternative available
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {/* Total Row */}
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan="11" className="py-4 px-6 text-right">
                      Total Amount:
                    </td>
                    <td className="py-2 px-2 text-lg text-green-800">
                      ₹ {calculateTotal()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleCheckout}
                disabled={Object.keys(selectedMedicines).length === 0}
                className={`${
                  Object.keys(selectedMedicines).length === 0
                    ? "bg-gray-400"
                    : "bg-green-600 hover:bg-green-700"
                } text-white px-8 py-3 rounded-lg transition-colors`}
              >
                Proceed to Checkout: ₹ {calculateTotal()}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;