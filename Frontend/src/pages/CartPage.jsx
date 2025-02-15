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

  const handleSelectionChange = (productId, isRecommended) => {
    setSelectedMedicines((prev) => {
      const currentSelection = prev[productId];

      // Toggle selection: if already selected, uncheck it
      if (currentSelection === (isRecommended ? "recommended" : "original")) {
        return { ...prev, [productId]: null }; // Unselect
      }

      return {
        ...prev,
        [productId]: isRecommended ? "recommended" : "original",
      };
    });
  };
  const updateMedicineSelection = (productId, isRecommended) => {
    setSelectedMedicines((prev) => {
      return {
        ...prev,
        [productId]: isRecommended ? "recommended" : "original",
      };
    });
};


  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        const product = item?.productId;
        const alternate = product?.alternateMedicines?.[0];
        const selection = selectedMedicines[product._id] || "original"; // Default to original if not selected

        // If this item is set to recommended and has an alternate, use alternate price
        if (selection === "recommended" && alternate) {
          return total + alternate.price * item.quantity;
        }

        // Otherwise use original price
        return total + product?.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const calculateMinimumSaving = () => {
    let totalMRP = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
      const product = item?.productId;
      if (product) {
        totalMRP += (product.mrp || 0) * (item.quantity || 1);
        totalPrice += (product.price || 0) * (item.quantity || 1);
      }
    });

    return (totalMRP - totalPrice).toFixed(2);
  };

  const calculateMaximumSaving = () => {
    let totalMRP = 0;
    let totalRecommendedPrice = 0;

    cart.forEach((item) => {
      const product = item?.productId;
      const alternate = product?.alternateMedicines?.[0]; // First alternative

      if (product) {
        totalMRP += (alternate.mrp || 0) * (item.quantity || 1);
        totalRecommendedPrice += (alternate.price || 0) * (item.quantity || 1);
      }
    });

    return (totalMRP - totalRecommendedPrice).toFixed(2);
  };

  const handleCheckout = () => {
    const selectedProducts = cart.map((item) => ({
      ...item,
      selection: selectedMedicines[item.productId._id] || "original", // Default to original if not set
      isRecommended: selectedMedicines[item.productId._id] === "recommended",
    }));

    const total = cart
      .reduce((sum, item) => {
        const product = item.productId;
        const isRecommended = selectedMedicines[product._id] === "recommended";
        const price =
          isRecommended && product.alternateMedicines?.[0]
            ? product.alternateMedicines[0].price
            : product.price;

        return sum + price * item.quantity;
      }, 0)
      .toFixed(2);

    navigate("/checkout", {
      state: {
        selectedProducts,
        total: total,
      },
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  const MobileCartItem = ({ item, index }) => {
    const product = item?.productId;
    const alternate = product?.alternateMedicines?.[0];
    const selection = selectedMedicines[product._id] || "original"; // Default to "original"
    const isOriginalSelected = selection === "original";
    const isRecommendedSelected = selection === "recommended";
  
    return (
      <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
        {/* Header row with Selected/Recommended headers */}
        <div className="flex bg-gray-50">
          <div className="w-1/2 py-2 px-3 text-left border-r border-gray-200">
            <span className="font-medium text-sm">Selected Medicine</span>
          </div>
          <div className="w-1/2 py-2 px-3 text-left">
            <span className="font-medium text-sm text-gray-600">Recommended Medicine</span>
          </div>
        </div>
        
        {/* Item number row */}
        <div className="flex bg-gray-100 border-t border-gray-200">
          <div className="w-1/6 py-2 px-2 text-left text-sm">
            Sr.{index + 1}
          </div>
          <div className="w-5/6"></div>
        </div>
        
        {/* Main content row */}
        <div className="flex border-t border-gray-200">
          {/* Selected Medicine Side */}
          <div className={`w-1/2 p-2 border-r border-gray-200 ${isOriginalSelected ? "bg-blue-50" : ""}`}>
            <div className="flex items-start mb-2">
              <input
                type="checkbox"
                name={`medicine-${product._id}`}
                onChange={() => handleSelectionChange(product._id, false)}
                checked={isOriginalSelected}
                defaultChecked={true}
                className="mt-1 mr-2"
              />
              <div>
                <div className="text-sm text-gray-900 font-medium">{product?.drugName}</div>
                <span className="text-xs text-gray-600">{product?.manufacturer}</span>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="text-xs pb-1">
                MRP: <span className="line-through">₹{product?.mrp}</span>
              </div>
              <div className="text-green-600 text-xs">
                Price: <span className="text-sm font-bold">₹{product?.price}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <button
                onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                className="flex items-center justify-center w-5 h-5 bg-gray-200 text-gray-700 rounded-full hover:bg-red-500 hover:text-white transition-all"
              >
                <span className="text-xs">−</span>
              </button>
              
              <span className="text-xs">
                <span className="text-gray-900 font-semibold">{item?.quantity || 0}</span>
              </span>
              
              <button
                onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                className="flex items-center justify-center w-5 h-5 bg-gray-200 text-gray-700 rounded-full hover:bg-green-500 hover:text-white transition-all"
              >
                <span className="text-xs">+</span>
              </button>
            </div>
            
            <div className="text-xs mb-2">
              Total: ₹{(product?.price * item.quantity).toFixed(2)}
            </div>
            
            <button
              onClick={() => handleDelete(product._id)}
              className="text-red-500 text-xs font-semibold hover:text-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
          
          {/* Alternative Medicine Side */}
          {alternate ? (
            <div className={`w-1/2 p-2 ${isRecommendedSelected ? "bg-green-50" : ""}`}>
              <div className="flex items-start mb-2">
                <input
                  type="checkbox"
                  name={`medicine-${product._id}`}
                  onChange={() => handleSelectionChange(product._id, true)}
                  checked={isRecommendedSelected}
                  className="mt-1 mr-2"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">{alternate.name}</div>
                  <span className="text-xs text-gray-600">manufacturer</span>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="text-xs pb-1">
                  MRP: <span className="line-through">₹{alternate.mrp}</span>
                </div>
                <div className="text-green-600 text-xs">
                  Price: <span className="text-sm font-bold">₹{alternate.price}</span>
                </div>
              </div>
              
              <div className="text-xs mb-2">
                Quantity: {item.quantity}
              </div>
              
              <div className="text-xs">
                Total: ₹{(alternate.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ) : (
            <div className="w-1/2 p-2 text-center text-xs text-gray-500 flex items-center justify-center">
              No alternative available
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Main mobile cart component
  const MobileCart = ({ cart }) => {
    return (
      <div className="block lg:hidden">
        {/* Top buttons for minimum/maximum savings */}
        <div className="flex justify-between mb-4">
          <button
            className="bg-red-400 text-white text-xs px-2 py-1 rounded-md"
            onClick={() => {
              cart.forEach((item) => updateMedicineSelection(item.productId._id, false));
            }}
          >
            Min Savings: ₹{calculateMinimumSaving()}
          </button>
          
          <button
            className="bg-green-400 text-white text-xs px-2 py-1 rounded-md"
            onClick={() => {
              cart.forEach((item) => updateMedicineSelection(item.productId._id, true));
            }}
          >
            Max Saving: ₹{calculateMaximumSaving()}
          </button>
        </div>
        
        {/* Cart items */}
        {cart.map((item, index) => (
          <MobileCartItem key={item.id} item={item} index={index} />
        ))}
        
        {/* Total row */}
        <div className="bg-gray-50 rounded-lg shadow-md p-3 flex justify-between items-center">
          <span className="font-semibold text-sm">Total Amount:</span>
          <span className="text-green-800 font-bold">₹ {calculateTotal()}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-10 px-4 pt-28">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-12">
          Your Cart
        </h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-12 text-center">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <MobileCart cart={cart} />

            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-lg shadow">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-3 text-left">No.</th>
                      <th
                        colSpan="5"
                        className="py-2 px-3 text-left border-r border-gray-200 font-medium text-[16px]"
                      >
                        Selected Medicine
                        <button
                          className="m-4 bg-red-400 text-white px-3 py-1 rounded-md"
                          onClick={() => {
                            cart.forEach((item) =>
                              updateMedicineSelection(item.productId._id, false)
                            );
                          }}
                        >
                          Minimum Savings: ₹{calculateMinimumSaving()}
                        </button>
                      </th>
                      <th
                        colSpan="4"
                        className="py-2 px-6 text-left font-medium text-[16px] text-gray-600"
                      >
                        Recommended Medicine
                        <button
                          className="m-4 bg-green-400 text-white px-3 py-1 rounded-md"
                          onClick={() => {
                            cart.forEach((item) =>
                              updateMedicineSelection(item.productId._id, true)
                            );
                          }}
                        >
                          Maximum Saving: ₹{calculateMaximumSaving()}
                        </button>
                      </th>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-3 text-left">Sr.no.</th>
                      <th className="py-3 px-10 text-left">Name</th>
                      <th className="py-3 text-left">Price/Unit</th>
                      <th className="py-3 px-6 text-left">Quantity</th>
                      <th className="py-3 px-5 text-left">Total (Rs.)</th>
                      <th className="py-3 px-4 text-left border-r border-gray-200">
                        Action
                      </th>
                      <th className="py-3 px-8 text-left">Name</th>
                      <th className="py-3 px-1 text-left">Price/Unit</th>
                      <th className="py-3 px-5 text-left">Quantity</th>
                      <th className="py-3 px-5 text-left">Total (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, index) => {
                      const product = item?.productId;
                      const alternate = product?.alternateMedicines?.[0];
                      const selection =
                        selectedMedicines[product._id] || "original"; // Default to "original"
                      const isOriginalSelected = selection === "original";
                      const isRecommendedSelected = selection === "recommended";

                      return (
                        <tr key={item.id} className="border-t border-gray-200">
                          <td className="py-2 px-4 text-[16px]">{index + 1}</td>

                          {/* Selected Medicine Side - Always highlighted by default */}
                          <td
                            className={`py-4 px-2 ${
                              isOriginalSelected ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div>
                                <input
                                  type="radio"
                                  name={`medicine-${product._id}`}
                                  onChange={() =>
                                    handleSelectionChange(product._id, false)
                                  }
                                  checked={isOriginalSelected}
                                  defaultChecked={true}
                                />
                              </div>
                              <div>
                                <div className="text-[16px] text-gray-900 font-medium">
                                  {product?.drugName}
                                </div>
                                <span className="text-xs text-gray-600">
                                  {product?.manufacturer}
                                </span>
                              </div>
                            </div>
                          </td>
                          {/* <td
                            className={`py-2 px-6 text-[16px] ${
                              isOriginalSelected ? "bg-blue-50" : ""
                            }`}
                          >
                            {product?.manufacturer}
                          </td> */}
                          <td
                            className={`py-2 w-32 ${
                              isOriginalSelected ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="text-sm pb-2">
                              MRP:{" "}
                              <span className="line-through">
                                ₹{product?.mrp}
                              </span>
                            </div>
                            <div className=" text-green-600">
                              Price:{" "}
                              <span className="text-lg font-bold">
                                ₹{product?.price}
                              </span>{" "}
                            </div>
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
                                      onChange={() =>
                                        handleSelectionChange(product._id, true)
                                      }
                                      checked={isRecommendedSelected}
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {alternate.name}
                                    </div>
                                    <span className="text-xs text-gray-600">
                                      manufacturer
                                    </span>
                                  </div>
                                </div>
                              </td>
                              {/* <td
                                className={`py-2 px-10 text-[16px] ${
                                  isRecommendedSelected ? "bg-green-50" : ""
                                }`}
                              >
                                <img
                                  src={alternate.manufacturerUrl}
                                  alt="Manufacturer"
                                  className="h-12 w-12 object-contain"
                                />
                              </td> */}

                              <td
                                className={`py-2 w-32 ${
                                  isRecommendedSelected ? "bg-green-50" : ""
                                }`}
                              >
                                <div className="text-sm pb-2">
                                  MRP:{" "}
                                  <span className="line-through">
                                    ₹{alternate.mrp}
                                  </span>
                                </div>
                                <div className=" text-green-600">
                                  Price:{" "}
                                  <span className="text-xl font-bold">
                                    ₹{alternate.price}
                                  </span>{" "}
                                </div>
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
                      <td colSpan="9" className="py-4 px-6 text-right">
                        Total Amount:
                      </td>
                      <td className="py-2 px-2 text-lg text-green-800">
                        ₹ {calculateTotal()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Checkout Button */}

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`${
                  cart.length === 0
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
