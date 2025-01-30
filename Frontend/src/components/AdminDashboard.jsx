import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("manageProducts");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [alternateProducts, setAlternateProducts] = useState([
    { name: "", manufacturer: "", manufacturerUrl: "", price: 0 },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(
          "http://localhost:5000/api/products/",
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
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderResponse = await axios.get(
          "http://localhost:5000/api/admin/orders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Fetched Orders:", orderResponse.data);

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChangeAlternateProduct = (index, field, value) => {
    const updatedAlternates = [...alternateProducts];
    updatedAlternates[index][field] = value;
    setAlternateProducts(updatedAlternates);
  };

  const addAlternateProduct = () => {
    setAlternateProducts([
      ...alternateProducts,
      { name: "", manufacturer: "", manufacturerUrl: "", price: 0 },
    ]);
  };

  const removeAlternateProduct = (index) => {
    const updatedAlternates = alternateProducts.filter((_, i) => i !== index);
    setAlternateProducts(updatedAlternates);
  };

  const validatePositiveNumber = (value) => {
    const num = parseFloat(value);
    return num > 0 && !isNaN(num);
  };

  const resetForm = () => {
    // Reset the fields for the main product form
    setAlternateProducts([
      { name: "", manufacturer: "", manufacturerUrl: "", price: 0 },
    ]);

    // Reset the general medicine fields
    document.getElementById("productForm").reset();
  };

  const createProduct = async (newProduct) => {
    const { price, mrp, margin } = newProduct;

    // Validation: Ensure price, mrp, and margin are positive numbers
    if (
      !validatePositiveNumber(price) ||
      !validatePositiveNumber(mrp) ||
      (margin && !validatePositiveNumber(margin))
    ) {
      toast.error("Price, MRP, and Margin must be positive numbers.");
      return;
    }

    try {
      const formattedProduct = {
        drugName: newProduct.drugName.trim(),
        size: newProduct.size.trim(),
        imageUrl: newProduct.imageUrl.trim(),
        manufacturer: newProduct.manufacturer.trim(),
        category: newProduct.category.trim(),
        price: parseFloat(newProduct.price),
        salt: newProduct.salt.trim(),
        mrp: parseFloat(newProduct.mrp),
        margin: newProduct.margin
          ? parseFloat(newProduct.margin)
          : newProduct.mrp - newProduct.price,
        alternateMedicines: alternateProducts.map((alt) => ({
          name: alt.name.trim(),
          manufacturer: alt.manufacturer.trim(),
          manufacturerUrl: alt.manufacturerUrl.trim(),
          price: parseFloat(alt.price),
        })),
      };

      console.log("Sending product data:", formattedProduct);

      const response = await axios.post(
        "http://localhost:5000/api/products/createProduct",
        formattedProduct,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setProducts((prevProducts) => [...prevProducts, response.data]);
      toast.success("Product created successfully!", {
        position: "top-center",
      });

      // Reset the form after successful product creation
      resetForm();
    } catch (error) {
      console.error(
        "Error creating product:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to create product. Please try again."
      );
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
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

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <nav className="mt-8">
          <button
            onClick={() => setActiveSection("createProduct")}
            className={`w-full mb-4 py-2 rounded-md font-medium text-white ${
              activeSection === "createProduct"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            Create Product
          </button>
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
            onClick={handleLogout}
            className="w-full mt-4 px-4 py-2 rounded-md font-medium text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-auto bg-white">
        {activeSection === "createProduct" && (
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Create Product
            </h1>
            <form
              id="productForm"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newProduct = Object.fromEntries(formData.entries());
                createProduct(newProduct);
              }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">General Medicine</h3>
                <label className="block font-medium">Drug Name</label>
                <input
                  type="text"
                  name="drugName"
                  required
                  className="w-full p-3 border rounded-lg"
                />
                <label className="block font-medium">ImageUrl</label>
                <input
                  type="text"
                  name="imageUrl"
                  required
                  className="w-full p-3 border rounded-lg"
                />

                <label className="block font-medium">Size</label>
                <input
                  type="text"
                  name="size"
                  required
                  className="w-full p-3 border rounded-lg"
                />

                <label className="block font-medium">Manufacturer</label>
                <input
                  type="text"
                  name="manufacturer"
                  required
                  className="w-full p-3 border rounded-lg"
                />

                <label className="block font-medium">Category</label>
                <input
                  type="text"
                  name="category"
                  required
                  className="w-full p-3 border rounded-lg"
                />

                <label className="block font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full p-3 border rounded-lg"
                />

                <label className="block font-medium">Salt</label>
                <input
                  type="text"
                  name="salt"
                  required
                  className="w-full p-3 border rounded-lg"
                />

                <label className="block font-medium">MRP</label>
                <input
                  type="number"
                  name="mrp"
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full p-3 border rounded-lg"
                />

                <label className="block font-medium">Margin</label>
                <input
                  type="number"
                  name="margin"
                  min="0.01"
                  step="0.01"
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Alternate Medicines</h3>
                {alternateProducts.map((alt, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <label className="block font-medium">Name</label>
                    <input
                      type="text"
                      value={alt.name}
                      onChange={(e) =>
                        handleChangeAlternateProduct(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                    <label className="block font-medium">Manufacturer</label>
                    <input
                      type="text"
                      value={alt.manufacturer}
                      onChange={(e) =>
                        handleChangeAlternateProduct(
                          index,
                          "manufacturer",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                    <label className="block font-medium">
                      Manufacturer URL
                    </label>
                    <input
                      type="text"
                      value={alt.manufacturerUrl}
                      onChange={(e) =>
                        handleChangeAlternateProduct(
                          index,
                          "manufacturerUrl",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                    <label className="block font-medium">Price</label>
                    <input
                      type="number"
                      value={alt.price || ""}
                      min="0.01"
                      step="0.01"
                      onChange={(e) =>
                        handleChangeAlternateProduct(
                          index,
                          "price",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded-lg"
                    />

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeAlternateProduct(index)}
                      className="text-red-500 text-lg font-semibold hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAlternateProduct}
                  className="w-full p-2 bg-blue-600 text-white rounded-lg"
                >
                  Add Alternate Medicine
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Product
              </button>
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
                      <th className="py-2 px-4 border-b">Drug Name</th>
                      <th className="py-2 px-4 border-b">Manufacturer</th>
                      <th className="py-2 px-4 border-b">Category</th>
                      <th className="py-2 px-4 border-b">MRP (₹)</th>
                      <th className="py-2 px-4 border-b">Selling Price (₹)</th>
                      <th className="py-2 px-4 border-b">Margin (₹)</th>
                      <th className="py-2 px-4 border-b">Salt Composition</th>
                      <th className="py-2 px-4 border-b">Alternatives</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="text-center">
                        <td className="py-2 px-4 border-b">
                          <img
                            src={product.imageUrl || "default-image.jpg"}
                            alt={product.drugName}
                            className="w-16 h-16 object-cover mx-auto"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">
                          {product.drugName}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {product.manufacturer}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {product.category}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {product.mrp.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {product.price.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {product.margin.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 border-b">{product.salt}</td>
                        <td className="py-2 px-4 border-b">
                          {product.alternateMedicines.length > 0 ? (
                            <ul className="text-left">
                              {product.alternateMedicines.map((alt, index) => (
                                <li key={index} className="border-b py-2">
                                  <div className="flex items-center space-x-2">
                                    <div>
                                      <p className="font-semibold">
                                        {alt.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {alt.manufacturer}
                                      </p>
                                      <a
                                        href={alt.manufacturerUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 text-xs"
                                      >
                                        {alt.manufacturerUrl}
                                      </a>
                                      <p className="text-xs text-green-600">
                                        Price: ${alt.price.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400">
                              No Alternatives
                            </span>
                          )}
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
