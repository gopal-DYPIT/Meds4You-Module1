import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MedicineCarousel from "../components/MedicineCarousel";
import CategoryFilter from "../components/CategoryFilter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Diabetes");

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
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }

    // If no category is selected, fetch "Top Sellers", otherwise fetch category-based products
    const categoryQuery = selectedCategory
      ? `?category=${selectedCategory}`
      : "";

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products${categoryQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Error fetching products:", err);
      });
  }, [selectedCategory]); // Fetch products whenever category changes

  const addToCart = async (productId) => {
    // console.log("Adding to cart:", productId);
    if (!user) {
      toast.info("Please log in to add items to your cart.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    } 

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
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
      toast.success("Added to Cart!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to Add to Cart. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-7xl mt-20 sm:mt-22 px-4">
        {/* Header Section */}
        <div className="text-center bg-blue-100 py-4 sm:py-16">
          <h1 className="text-2xl sm:text-4xl font-bold mb-0 text-gray-800 sm:mb-2">
            Your Partner in Affordable Healthcare
          </h1>
        </div>

        <div className="flex justify-start ml-4 sm:ml-11 mt-0 sm:mb-[4px]  sm:mt-[20px]">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* Medicine Carousel */}
        <div className="px-0 sm:px-8 mt-[-6rem] mb-0 sm:mb-8 sm:mt-[-6rem] ">
          <MedicineCarousel products={products} addToCart={addToCart} isLoading={isLoading}/>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-100 py-6 sm:py-12 mt-[-6rem] sm:mt-[-4rem] px-4 sm:px-12">
          <h2 className="text-lg sm:text-3xl font-bold mb-4 sm:mb-6 text-left">
            Why Choose Us?
          </h2>
          <ul className="list-none text-sm sm:text-lg text-left space-y-2 sm:space-y-3">
            <li>✅ Save up to 30% with high-quality generic alternatives.</li>
            <li>📑 Easy prescription upload and alternative suggestions.</li>
            <li>🌍 Dedicated to making healthcare accessible to all.</li>
          </ul>
        </div>

        {/* WhatsApp Floating Button */}
        <section className="fixed bottom-14 right-2 sm:right-4 z-50">
          <a
            href="https://wa.me/918484883367?text=Hello%20there!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 sm:px-5 py-2 sm:py-3 bg-green-500 text-white rounded-full shadow-lg transition hover:bg-green-600"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              className="w-5 sm:w-6 h-5 sm:h-6 mr-2"
            />
            <span className="text-sm sm:text-lg font-bold">
              Chat on WhatsApp
            </span>
          </a>
        </section>

        {/* Testimonials Section */}
        <section className="py-8 sm:py-12" id="happy-customers">
          <h2 className="text-center sm:text-left text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-black-800">
            💬 Hear from Our Happy Customers
          </h2>

          {/* Mobile Slide */}
          <div className="sm:hidden">
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              // navigation
              // pagination={{ clickable: true }}
              modules={[Autoplay, Pagination]}
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="rounded-lg shadow-md flex flex-col justify-end text-left relative overflow-hidden h-[400px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${testimonial.image})` }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <div className="relative z-10 p-3 text-white mt-auto">
                      <h3 className="font-semibold text-xs mb-1">
                        <span className="mr-1">😊</span>
                        {testimonial.name}{" "}
                        <span className="text-gray-300">
                          | {testimonial.age}
                        </span>
                      </h3>
                      <p className="text-xs mt-1 leading-tight">
                        {testimonial.text}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 px-2 sm:px-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-lg shadow-md flex flex-col justify-end text-left relative overflow-hidden h-[250px] sm:h-[300px] bg-cover bg-center"
                style={{ backgroundImage: `url(${testimonial.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 sm:bg-opacity-50"></div>
                <div className="relative z-10 p-3 sm:p-4 text-white mt-auto">
                  <h3 className="font-semibold text-xs sm:text-sm mb-1">
                    <span className="mr-1 sm:mr-2">😊</span>
                    {testimonial.name}{" "}
                    <span className="text-gray-300">| {testimonial.age}</span>
                  </h3>
                  <p className="text-xs sm:text-sm mt-1 sm:mt-2 leading-tight">
                    {testimonial.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Home;
