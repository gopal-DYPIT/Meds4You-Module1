import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const MedicineCarousel = ({ products, addToCart }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState({});

  const handleAddToCart = (productId, variantIndex) => {
    if (!isAuthenticated) {
      toast.error("Login user first", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      addToCart(productId);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (swiperInstance) swiperInstance.autoplay.stop();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (swiperInstance) swiperInstance.autoplay.start();
  };

  return (
    <div className="px-8">
      <h1 className="text-center font-lato text-3xl m-10 mb-6">Medicines</h1>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        spaceBetween={20}
        slidesPerView={3}
        loop={true}
        className="min-h-[500px] max-w-[1200px] mx-auto relative"
        onSwiper={setSwiperInstance}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div
              className="bg-[#f8fff4] rounded-lg overflow-hidden shadow-md pb-4"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Main Medicine */}
              <div className="border-b border-gray-200">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-white text-md text-center bg-[#225f6a] w-full p-2">
                    {product.drugName}
                  </h3>
                  <div className="flex justify-center my-4">
                    <img
                      src={product.imageUrl || "default-image.jpg"}
                      alt={product.drugName}
                      className="w-28 h-28 object-cover rounded-md"
                    />
                  </div>
                  <div className="px-4">
                    <p className="text-gray-600 font-semibold text-sm mb-1">
                      {product.salt}
                    </p>
                    <p className="text-gray-600 font-semibold text-sm mb-2">
                      {product.manufacturer}
                    </p>
                    <p className="text-[#707a81] font-semibold text-xs mb-2">
                      {product.category}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg text-[#62965b] font-bold font-lato">
                        ₹{product.price}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-xs font-semibold text-white bg-[#ec6666] px-1 py-1 rounded-md">
                          {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>

              {/* Alternate Medicines */}
              <div className="px-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Alternative Options:</h4>
                <div className="space-y-3">
                  {product.alternateMedicines?.map((alt, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-md cursor-pointer transition-colors ${
                        selectedVariant[product._id] === index
                          ? "bg-[#e8f4e6] border border-[#62965b]"
                          : "bg-white border border-gray-200"
                      }`}
                      onClick={() => setSelectedVariant({ ...selectedVariant, [product._id]: index })}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{alt.name}</p>
                          <a
                            href={alt.manufacturerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#225f6a] hover:underline"
                          >
                            {alt.manufacturer}
                          </a>
                        </div>
                        <span className="text-[#62965b] font-semibold">₹{alt.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Single Add to Cart Button */}
              <div className="px-4 mt-4">
                <button
                  onClick={() => handleAddToCart(
                    product._id,
                    selectedVariant[product._id]
                  )}
                  className="w-full bg-[#4a8694] text-white py-2 px-4 rounded-md hover:bg-[#3a6a74] transition-colors"
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