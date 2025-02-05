import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
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
const arrowStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 10,
  cursor: "pointer",
  background: "rgba(0, 0, 0, 0.5)",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  fontSize: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "opacity 0.3s ease",
};

// Adjust the position of the navigation buttons
const prevArrowStyle = {
  ...arrowStyle,
  left: "-70px", // Move further left
};

const nextArrowStyle = {
  ...arrowStyle,
  right: "-70px", // Move further right
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

  return (
    <div style={cardStyle}>
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={20}
        slidesPerView={3}
        loop={true}
        style={{ padding: "10px 0", paddingBottom: "40px" }}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
      >
        {products.map((product) => (
          <SwiperSlide
            key={product._id}
            style={{ display: "flex", justifyContent: "center" }}
            onMouseEnter={() => swiperInstance?.autoplay.stop()} // Stop autoplay when hovering
            onMouseLeave={() => swiperInstance?.autoplay.start()} // Resume autoplay when leaving
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
        <div
          className="swiper-button-prev"
          style={prevArrowStyle}
        ></div>
        <div
          className="swiper-button-next"
          style={nextArrowStyle}
        ></div>
      </Swiper>
    </div>
  );
};

export default MedicineCarousel;
