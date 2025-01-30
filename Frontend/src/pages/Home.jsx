import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MedicineCarousel from "../components/MedicineCarousel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  const testimonials = [
    {
      name: "Amit K.",
      age: 70,
      image:
        "https://img.freepik.com/premium-photo/indian-confident-male-cancer-survivor-who-is-bald-standing-hospital_466689-96148.jpg",
      text: "Meds4You helped me save thousands on my monthly medicine bills!",
    },
    {
      name: "Rajesh M.",
      age: 27,
      image:
        "https://cdn.pixabay.com/photo/2024/03/31/05/00/ai-generated-8665996_960_720.jpg",
      text: "Quality medicines at unbeatable prices. Highly recommend!",
    },
    {
      name: "Preeti S.",
      age: 45,
      image:
        "https://www.womenentrepreneursreview.com/entrepreneur_images/news_images/671b6cc938d27_1.jpg",
      text: "Meds4You's recommendations are spot-on, and the discounts are amazing!",
    },
    {
      name: "Neha P.",
      age: 23,
      image:
        "https://media.istockphoto.com/id/1987655119/photo/smiling-young-businesswoman-standing-in-the-corridor-of-an-office.jpg?s=612x612&w=0&k=20&c=5N_IVGYsXoyj-H9vEiZUCLqbmmineaemQsKt2NTXGms=",
      text: "Timely delivery and genuine products. A trustworthy service!",
    },
  ];

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }

    axios.get("http://localhost:5000/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  const addToCart = async (productId) => {
    if (!user) {
      toast.info("Please log in to add items to your cart.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          userId: user.token,
          productId: productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // console.log('Cart updated:', response.data);
      toast.success("Added to Cart!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      console.log("Failed to add to cart:", err.response || err);
      toast.error("Failed to Add to Cart. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-7xl mt-20">
        {/* Header Section */}
        <div className="header-section text-center bg-blue-100 py-16">
          <h1 className="text-4xl font-bold text-[#333333] mb-4">
            Your Partner in Affordable Healthcare
          </h1>
          <div className="space-x-4">
            <Link to="/infoOrder">
              <button className="bg-[#d1f3e0] text-[#444444] px-6 py-2 rounded-full hover:bg-[#4CAF50]">
                Upload Prescription
              </button>
            </Link>
            <Link to="/join-partner">
              <button className="bg-[#d1f3e0] text-[#444444] px-6 py-2 rounded-full hover:bg-[#4CAF50]">
                Join as Store Partner
              </button>
            </Link>
          </div>
        </div>

        {/* Medicine Carousel */}
        <div className="px-8 mt-8">
          <MedicineCarousel products={products} addToCart={addToCart} />
        </div>

        {/* Why Choose Us Section */}
        <div className="why-choose-us bg-gray-100 py-12">
          <h2 className="text-2xl font-bold text-center mb-6">
            Why Choose Us?
          </h2>
          <ul className="list-none text-center">
            <li>Save up to 30% with high-quality generic alternatives.</li>
            <li>Easy prescription upload and alternative suggestions.</li>
            <li>Dedicated to making healthcare accessible to all.</li>
          </ul>
        </div>

        {/* WhatsApp Section */}
        <section
          style={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            zIndex: 1000,
          }}
        >
          <a
            href="https://wa.me/918459708577?text=Hello%20there!"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              backgroundColor: "#25D366",
              color: "white",
              borderRadius: "50px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1EBE55")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#25D366")
            }
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              style={{
                width: "24px",
                height: "24px",
                marginRight: "8px",
              }}
            />
            <span
              style={{
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Chat on WhatsApp
            </span>
          </a>
        </section>

        {/* {Medicine Chronic Categories} */}
        <section style={{ padding: "30px 0", backgroundColor: "#FFF7F5" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "left",
              marginBottom: "20px",
            }}
          >
            👍Highlighted Categories:
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", // Adjusts number of columns dynamically
              gap: "20px", // Space between grid items
              justifyItems: "center", // Centers items horizontally
              alignItems: "start", // Aligns items at the top
            }}
          >
            {[
              {
                title: "Heart Health",
                image:
                  "https://files.oaiusercontent.com/file-SLM2QSZw97FRQQ195pYkC3?se=2024-12-30T03%3A28%3A27Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Df69f7fe3-6b2e-4f5b-af51-fb8121464098.webp&sig=999qfyDV51sek4A0JMEPB4bTu6d3vUQnPfI%2BO08Ytew%3D",
              },
              {
                title: "Diabetes Management",
                image:
                  "https://files.oaiusercontent.com/file-2fmzR7R5cH5mCBL6ALrP3v?se=2024-12-30T03%3A28%3A40Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D85ced114-a728-44d1-9a8c-b3c4306c90ef.webp&sig=hJtQFERnFwwk8XmuniGg6VX8RB8ZDW9EDUeopg57VRE%3D",
              },
              {
                title: "Pain Relief",
                image:
                  "https://cdn-platinumrx.azureedge.net/platinumrx-assets/category-heart-care1.png?w=384&q=80",
              },
              {
                title: "Vitamins & Supplements",
                image:
                  "https://cdn-platinumrx.azureedge.net/platinumrx-assets/category-joints-and-muscle1.png?w=384&q=80",
              },
            ].map((category, index) => (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  maxWidth: "200px", // Ensures consistent size for items
                }}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  style={{
                    width: "100%", // Makes image fill the container
                    height: "auto", // Maintains aspect ratio
                    objectFit: "cover", // Ensures the image does not get distorted
                    borderRadius: "5px", // Adds rounded corners
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional shadow
                  }}
                />
                <p
                  style={{ marginTop: "10px", fontWeight: "bold", color: "#333" }}
                >
                  {category.title}
                </p>
              </div>
            ))}
          </div>
        </section>


        {/* Customer Testimonials Section */}
        <section className="py-0" id="happy-customers">
          <h2 className="text-left text-2xl font-bold mb-6 text-black-800">
            💬 Hear from Our Happy Customers
          </h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-lg shadow-md flex flex-col justify-end text-left relative overflow-hidden"
                style={{
                  backgroundImage: `url(${testimonial.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "300px",
                }}
              >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                {/* Content */}
                <div className="relative z-10 p-4 text-white mt-auto">
                  <h3 className="font-semibold text-sm mb-1">
                    <span className="mr-2">😊</span>
                    {testimonial.name}{" "}
                    <span className="text-gray-300">| {testimonial.age}</span>
                  </h3>
                  <p className="text-xs mt-2 leading-tight">{testimonial.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Toastify Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Home;
