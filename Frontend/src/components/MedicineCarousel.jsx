import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const cardStyle = {
  margin: "6rem auto",
  fontFamily: "Poppins, sans-serif",
  maxWidth: "1400px",
  position: "relative",
};

const wholeCardStyle = {
  display: "flex",
  flexDirection: "column",
  height: "400px",
  width: "350px",
  borderRadius: "10px",
  boxShadow:
    "rgba(228, 76, 76, 0.1) 0px 1px 1px, rgba(230, 64, 64, 0.1) 1px 1px 10px, rgba(236, 40, 59, 0.1) 0px 1px 15px",
};

const topStyle = {
  color: "white",
  backgroundColor: "#d9327a",
  fontSize: "1rem",
  textAlign: "center",
  borderRadius: "10px 10px 0 0",
  padding: "5px",
  fontWeight: "500",
};

const mainStyle = {
  height: "98%",
  width: "100%",
  display: "flex",
};

const leftRightCommonStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  width: "50%",
  padding: "5px",
  paddingLeft: "20px",
  gap: "2px",
};

const rightStyle = {
  display: "flex",
  flexDirection: "column",
  width: "50%",
  padding: "5px",
  backgroundColor: "rgb(246, 255, 243)",
  borderRadius: "0 0 10px 0",
  paddingRight: "15px",
  paddingBottom: "15px",
  overflow: "hidden",
  alignItems: "center",
  justifyContent: "space-between", // Keeps Add to Cart button at bottom
};

const recommendedContainerStyle = {
  maxHeight: "220px", // Prevents overflow
  // overflowY: "auto", // Enables scrolling
  width: "100%",
};

const alternateMedicineStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "15px", // Adjusted margin
  textAlign: "center",
};

const MedicineCarousel = ({ products, addToCart }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [swiperInstance, setSwiperInstance] = useState(null);

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

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const isDesktop = window.innerWidth >= 1024;

  return (
    <div style={cardStyle}>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        spaceBetween={20}
        loop={true}
        freeMode={true}
        grabCursor={true}
        touchStartPreventDefault={false} // ✅ Allows better touch gestures on mobile
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        style={{ paddingBottom: "20px" }}
        breakpoints={{
          0: {
            // ✅ Ensures smooth mobile experience
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
      >
        {products.map((product) => (
          <SwiperSlide
            key={product._id}
            style={{ display: "flex", justifyContent: "center" }}
            onMouseEnter={() => isDesktop && swiperInstance?.autoplay.stop()} // Stop autoplay only on desktop
            onMouseLeave={() => isDesktop && swiperInstance?.autoplay.start()} // Resume autoplay only on desktop
          >
            <div style={wholeCardStyle}>
              <div style={topStyle}>{product.salt}</div>
              <div style={mainStyle}>
                <div style={leftRightCommonStyle}>
                  <b>Regular</b>
                  <img
                    src={product.imageUrl || "default-image.jpg"}
                    alt="Tablet"
                    style={{ height: "40px", width: "100px" }}
                  />
                  <b>{product.drugName}</b>
                  <p style={{ marginBottom: "8px", lineHeight: "1.5" }}>
                    {product.manufacturer}
                  </p>
                  <p style={{ marginBottom: "4px", lineHeight: "1.2" }}>
                    {product.category}
                  </p>
                  <p>MRP: ₹{product.mrp}</p>
                </div>
                <div style={rightStyle} className="mt-3">
                  <b>Recommended</b>
                  <div style={recommendedContainerStyle}>
                    {product.alternateMedicines?.map((alt, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          setSelectedVariant({
                            ...selectedVariant,
                            [product._id]: index,
                          })
                        }
                        style={alternateMedicineStyle}
                      >
                        <img
                          src={alt.manufacturerUrl || "default-image.jpg"}
                          alt="Tablet"
                          style={{ height: "40px", width: "100px" }}
                        />
                        <div className="pt-4 font-bold">{alt.name}</div>
                        <div className="pt-4 font-roboto text-xl">
                          {alt.manufacturer}
                        </div>
                        <div
                          className="font-bold text-2xl"
                          style={{ color: "rgb(12, 159, 12)" }}
                        >
                          ₹{alt.price}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="bg-[#419ec8] hover:bg-[#3b9075] text-white px-4 py-2 border-none h-10 w-36 text-lg rounded-lg opacity-60 transition duration-300"
                    onClick={() =>
                      handleAddToCart(product._id, selectedVariant[product._id])
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="my-swiper relative pb-3.5">
        <div
          id="swiper-button-prev"
          className="hidden sm:flex absolute top-1/2 transform -translate-y-1/2 justify-center items-center w-12 h-12 bg-gray-200 text-gray-800 rounded-full shadow-lg cursor-pointer transition-all ease-in-out duration-200 z-10 left-1/2 sm:left-0 md:left-10 lg:left-20"
          onClick={handlePrev}
          style={{ top: "-230px", left: "-16px" }}
        >
          <span className="text-2xl">&#10094;</span>
        </div>

        <div
          id="swiper-button-next"
          className="hidden sm:flex absolute top-1/2 transform -translate-y-1/2 justify-center items-center w-12 h-12 bg-gray-200 text-gray-800 rounded-full shadow-lg cursor-pointer transition-all ease-in-out duration-200 z-10 right-1/2 sm:right-0 md:right-10 lg:right-20"
          onClick={handleNext}
          style={{ top: "-230px", right: "-16px" }}
        >
          <span className="text-2xl">&#10095;</span>
        </div>
      </div>
    </div>
  );
};

export default MedicineCarousel;
