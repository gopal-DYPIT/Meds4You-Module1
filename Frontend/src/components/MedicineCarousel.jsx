import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const MedicineCarousel = ({ products, addToCart }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [swiperInstance, setSwiperInstance] = useState(null); // Store swiper instance
  const [isHovering, setIsHovering] = useState(false); // State for hover detection

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) {
      toast.error("Login user first",{
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else {
      addToCart(productId);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (swiperInstance) swiperInstance.autoplay.stop(); // Stop autoplay when hovering
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (swiperInstance) swiperInstance.autoplay.start(); // Start autoplay when not hovering
  };

  return (
    <div className="px-8">
      <h1 className="text-center font-lato text-3xl m-10 mb-6">Medicines</h1>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        spaceBetween={10}
        slidesPerView={4}
        loop={true}
        className="min-h-[400px] max-w-[1000px] mx-auto relative"
        onSwiper={setSwiperInstance} // Store swiper instance
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div
              className="max-w-xs bg-[#f8fff4] rounded-lg overflow-hidden shadow-md pb-8"
              onMouseEnter={handleMouseEnter} // Detect mouse enter
              onMouseLeave={handleMouseLeave} // Detect mouse leave
            >
              <div>
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-white text-md text-center bg-[#225f6a] w-full mb-4 p-2">
                    {product.name}
                  </h3>
                  <div className="flex justify-center mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-28 h-28 object-cover rounded-md mx-auto"
                    />
                  </div>
                  <p className="text-gray-600 font-semibold text-sm mb-1 ml-2 w-52">
                    {product.description}
                  </p>
                  <p className="text-gray-600 font-semibold text-sm mb-2 ml-2 w-52">
                    {product.type}
                  </p>
                  <div className="flex justify-start mb-2 ml-1">
                    <img
                      src={product.brand}
                      alt="Brand"
                      className="h-6 object-cover rounded-md"
                    />
                  </div>
                  <p className="text-[#707a81] font-semibold text-xs mb-2 ml-1">
                    {product.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-[#62965b] font-bold font-lato ml-2">
                      ₹{product.price}
                    </span>
                    {product.discount && (
                      <span className="text-xs font-semibold text-white bg-[#ec6666] px-1 py-1 mr-2 rounded-md">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="mt-2 w-full mx-auto bg-[#4a8694] text-white py-2 px-4 rounded-md hover:bg-[#3a6a74]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MedicineCarousel;
