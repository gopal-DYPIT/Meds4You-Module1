import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// ✅ Redux Imports for Auth State Management
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import ManagePrescriptions from "./ManagePrescriptions";
import ManagePartners from "./ManagePartners";
import ManageUsers from "./ManageUsers";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("manageProducts");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [authState, setAuthState] = useState(isAuthenticated);

  useEffect(() => {
    setAuthState(isAuthenticated);
  }, [isAuthenticated]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!authState) return;
      try {
        const productResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setProducts(
          Array.isArray(productResponse.data) ? productResponse.data : []
        );
        setLoadingProducts(false);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error.response?.data || error.message
        );
        setLoadingProducts(false);
      }
    };

    fetchData();
  }, [authState]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!authState) return;
      try {
        const orderResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/admin/orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // console.log("Fetched Orders:", orderResponse.data);

        setOrders(orderResponse.data || []); // Update state with the fetched data
        setLoadingOrders(false);
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error.response?.data || error.message
        );
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [authState]);

  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "token" && !event.newValue) {
        dispatch(logout());
        navigate("/login");
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, [dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout()); // ✅ Update Redux auth state
    setAuthState(false); // ✅ Force component to recognize logout
    navigate("/login"); // ✅ Redirect after logout
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
      toast.success("Product deleted successfully!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const updateOrderStatus = async (orderId, status, paymentStatus) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin/orders/${orderId}/status`,
        { orderStatus: status, paymentStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: status, paymentStatus }
            : order
        )
      );
      toast.success("Order Status updated successfully!", {
        position: "top-center",
      });
    } catch (error) {
      console.error(
        "Error updating order status:",
        error.response?.data || error.message
      );
    }
  };

  const handleOrderClick = async (order) => {
    try {
      // Fetch additional details for the selected order (including user and product details)
      const orderResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/admin/orders/${
          order._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Ensure you're using the orderResponse data properly by extracting properties
      const orderDetails = orderResponse.data;

      setSelectedOrderDetails(orderDetails); // Set the selected order details
      // console.log("Selected Order Details:", orderDetails);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <nav className="mt-8">
          <button
            onClick={() => setActiveSection("manageProducts")}
            className={`w-full mb-4 px-4 py-2 rounded-md font-medium text-white ${
              activeSection === "manageProducts"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            Manage Products
          </button>
          <button
            onClick={() => {
              // console.log("Setting active section to manageOrders");
              setActiveSection("manageOrders");
            }}
            className={`w-full mb-4 px-4 py-2 rounded-md font-medium text-white ${
              activeSection === "manageOrders"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            Manage Orders
          </button>
          <button
            onClick={() => {
              // console.log("Setting active section to manageOrders");
              setActiveSection("managePrescription");
            }}
            className={`w-full mb-4 px-4 py-2 rounded-md font-medium text-white ${
              activeSection === "managePrescription"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            Prescriptions
          </button>
          <button
            onClick={() => {
              // console.log("Setting active section to manageOrders");
              setActiveSection("manageUsers");
            }}
            className={`w-full mb-4 px-4 py-2 rounded-md font-medium text-white ${
              activeSection === "manageUsers"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => {
              // console.log("Setting active section to manageOrders");
              setActiveSection("managePartner");
            }}
            className={`w-full mb-4 px-4 py-2 rounded-md font-medium text-white ${
              activeSection === "managePartner"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            Manage Partners
          </button>
          <button
            onClick={handleLogout}
            className="w-full mt-4 px-4 py-2 rounded-md font-medium text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-auto bg-white">
        {/* Manage Products Section */}
        {activeSection === "manageProducts" && (
          <div>
            <h1 className="text-lg font-semibold mb-4">Manage Products</h1>
            {loadingProducts ? (
              <div>Loading products...</div>
            ) : products.length === 0 ? (
              <div>No products available</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-xs text-left">
                      <th className="py-2 px-3 border-b">Image</th>
                      <th className="py-2 px-3 border-b">
                        Drug Name & Manufacturer
                      </th>
                      <th className="py-2 px-3 border-b">Category</th>
                      <th className="py-2 px-3 border-b">MRP (₹)</th>
                      <th className="py-2 px-3 border-b">Selling Price (₹)</th>
                      <th className="py-2 px-3 border-b">Salt Composition</th>
                      <th className="py-2 px-3 border-b">Recommended</th>
                      <th className="py-2 px-3 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="text-xs border-b">
                        <td className="py-2 px-3">
                          <img
                            src={product.imageUrl || "default-image.jpg"}
                            alt={product.drugName}
                            className="w-12 h-12 object-cover mx-auto"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <p className="font-medium">{product.drugName}</p>
                          <p className="text-gray-500 text-xs">
                            {product.manufacturer}
                          </p>
                        </td>
                        <td className="py-2 px-3">{product.category}</td>
                        <td className="py-2 px-3">{product.mrp.toFixed(2)}</td>
                        <td className="py-2 px-3">
                          {product.price.toFixed(2)}
                        </td>
                        <td className="py-2 px-3">{product.salt}</td>
                        <td className="py-2 px-3">
                          {product.alternateMedicines.length > 0 ? (
                            <ul className="text-left space-y-1">
                              {product.alternateMedicines.map((alt, index) => (
                                <li key={index} className="border-b pb-1">
                                  <p className="font-medium">{alt.name}</p>
                                  <p className="text-gray-500 text-xs">
                                    {alt.manufacturer}
                                  </p>
                                  <p className="text-green-600 text-xs">
                                    MRP: ₹{alt.mrp.toFixed(2)}
                                  </p>
                                  <p className="text-green-600 text-xs">
                                    Price: ₹{alt.price.toFixed(2)}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400">
                              No Alternatives
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Manage Orders Section */}
        {activeSection === "manageOrders" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
            {loadingOrders ? (
              <div>Loading orders...</div>
            ) : orders.length === 0 ? (
              <div>No orders available</div>
            ) : (
              <div className="overflow-x-auto px-6">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 pr-6 border-b">Order ID</th>
                      <th className="py-2 pr-28 border-b">Order Status</th>
                      <th className="py-2 pr-24 border-b">Payment Status</th>
                      {/* <th className="py-2 pr-14 border-b">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        onClick={() => handleOrderClick(order)}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        <td className="py-2 px-6 border-b">{order._id}</td>
                        <td className="py-2 px-10 border-b">
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              updateOrderStatus(
                                order._id,
                                e.target.value,
                                order.paymentStatus
                              )
                            }
                            className="border p-2 ml-8 rounded"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-2 px-14 border-b">
                          <select
                            value={order.paymentStatus}
                            onChange={(e) =>
                              updateOrderStatus(
                                order._id,
                                order.orderStatus,
                                e.target.value
                              )
                            }
                            className="border p-2 rounded"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </td>
                        {/* <td className="py-2 px-4 border-b">
                          <button
                            onClick={() =>
                              updateOrderStatus(
                                order._id,
                                order.orderStatus,
                                order.paymentStatus
                              )
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Update
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {selectedOrderDetails && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold">Order Details</h2>
                <div className="border-t-2 mt-4">
                  <h3 className="text-xl">User Information</h3>
                  {/* Displaying user information */}
                  <p>Name: {selectedOrderDetails.userId?.name}</p>
                  <p>
                    Phone Number: {selectedOrderDetails.userId?.phoneNumber}
                  </p>

                  {/* Rendering addresses */}
                  <div>
                    <h3>Addresses:</h3>
                    {selectedOrderDetails.userId?.addresses &&
                    selectedOrderDetails.userId.addresses.length > 0 ? (
                      <ul>
                        {selectedOrderDetails.userId.addresses.map(
                          (address, index) => (
                            <li key={index}>
                              {address.street}, {address.city}, {address.state},{" "}
                              {address.zipCode}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>No addresses available</p>
                    )}
                  </div>
                </div>

                <h3 className="text-xl mt-4">Order Items</h3>
                {/* Rendering order items */}
                {selectedOrderDetails.items.map((item, index) => (
                  <div key={index} className="border-t py-2">
                    <p>
                      Product: {item.productId ? item.name : "No product name"}
                    </p>
                    <p>Price: ₹{item.price ? item.price.toFixed(2) : "N/A"}</p>
                    <p>Quantity: {item.quantity ? item.quantity : "N/A"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeSection === "managePrescription" && <ManagePrescriptions />}
        {activeSection === "manageUsers" && <ManageUsers />}
        {activeSection === "managePartner" && <ManagePartners />}
      </main>
    </div>
  );
};

export default AdminDashboard;
