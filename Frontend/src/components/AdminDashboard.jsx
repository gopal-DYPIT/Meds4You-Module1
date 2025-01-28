import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("manageProducts"); // Default section
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const navigate = useNavigate();

  // Fetch products and orders from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get("/api/products/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // console.log("Fetched products:", productResponse.data);

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
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderResponse = await axios.get("/api/admin/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

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
  }, []); // Empty dependency array to run only once on mount

  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/login");
  };

  // Function to create a new product
  const createProduct = async (newProduct) => {
    try {
      // Ensure the product data is correctly formatted
      const formattedProduct = {
        name: newProduct.name,
        image: newProduct.image,
        description: newProduct.description,
        type: newProduct.type,
        brand: newProduct.brand,
        category: newProduct.category,
        price: parseFloat(newProduct.price), // Ensure price is a number
        discount: newProduct.discount ? parseFloat(newProduct.discount) : 0, // Handle discount if provided
      };

      console.log("Sending product data:", formattedProduct);

      const response = await axios.post(
        "/api/admin/products",
        formattedProduct,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProducts((prevProducts) => [...prevProducts, response.data]);

      toast.success("Product created successfully!", {
        position: "top-center",
      });
      // alert("Product created successfully!");
    } catch (error) {
      console.error(
        "Error creating product:",
        error.response ? error.response.data : error.message
      );
      alert("Error creating product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
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

  // const deleteOrder = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:5000/api/admin/orders/`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
  //   } catch (error) {
  //     console.error("Error deleting order:", error);
  //   }
  // };

  // console.log("Active Section:", activeSection);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-4">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
        </div>
        <nav className="flex flex-col p-4">
          <button
            onClick={() => setActiveSection("createProduct")}
            className={`mb-2 text-left px-4 py-2 rounded ${
              activeSection === "createProduct"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            Create Product
          </button>
          <button
            onClick={() => setActiveSection("manageProducts")}
            className={`mb-2 text-left px-4 py-2 rounded ${
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
            className={`mb-2 text-left px-4 py-2 rounded ${
              activeSection === "manageOrders"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            Manage Orders
          </button>

          <button
            onClick={handleLogout}
            className="mt-4 text-red-500 hover:text-red-700 text-left px-4 py-2 rounded"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Create Product Section */}
        {activeSection === "createProduct" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Create Product</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newProduct = Object.fromEntries(formData.entries());

                // Convert numerical fields
                newProduct.price = parseFloat(newProduct.price);
                newProduct.discount = parseFloat(newProduct.discount);

                // Optional: Validate URLs (image and brand)
                const urlPattern = new RegExp(
                  "^(https?:\\/\\/)?" + // protocol
                    "((([a-zA-Z0-9\\-\\.]+)\\.([a-zA-Z]{2,5}))|" + // domain name
                    "localhost)" + // localhost
                    "(\\:[0-9]{1,5})?" + // port
                    "(\\/.*)?$" // path
                );

                if (!urlPattern.test(newProduct.image)) {
                  alert("Please enter a valid Image URL.");
                  return;
                }

                if (!urlPattern.test(newProduct.brand)) {
                  alert("Please enter a valid Brand Logo URL.");
                  return;
                }

                createProduct(newProduct);
                e.target.reset();
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Product Name */}
              <div>
                <label className="block mb-1 font-semibold">Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Thyroxine 12.5mcg"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block mb-1 font-semibold">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="82.9"
                  step="0.01"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block mb-1 font-semibold">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  placeholder="50"
                  step="0.01"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block mb-1 font-semibold">Image URL</label>
                <input
                  type="url"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Brand Logo URL */}
              <div>
                <label className="block mb-1 font-semibold">
                  Brand Logo URL
                </label>
                <input
                  type="url"
                  name="brand"
                  placeholder="https://example.com/brand-logo.webp"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block mb-1 font-semibold">Type</label>
                <input
                  type="text"
                  name="type"
                  placeholder="Tab 100s"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Category */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold">Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder="Bottle of 100 tablets"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold">Description</label>
                <textarea
                  name="description"
                  placeholder="Thiroace 12.5mcg"
                  required
                  className="w-full p-2 border rounded h-24"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Manage Products Section */}
        {activeSection === "manageProducts" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
            {loadingProducts ? (
              <div>Loading products...</div>
            ) : products.length === 0 ? (
              <div>No products available</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Image</th>
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">Price ($)</th>
                      <th className="py-2 px-4 border-b">Discount (%)</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="text-center">
                        <td className="py-2 px-4 border-b">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover mx-auto"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">{product.name}</td>
                        <td className="py-2 px-4 border-b">
                          {product.price.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {product.discount}%
                        </td>
                        <td className="py-2 px-4 border-b">
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
                      <th className="py-2 pr-16 border-b">Order Status</th>
                      <th className="py-2 pr-24 border-b">Payment Status</th>
                      <th className="py-2 pr-14 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
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
                        <td className="py-2 px-4 border-b">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
