import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const cardStyle = {
  margin: "5rem auto",
  fontFamily: "Poppins, sans-serif",
  maxWidth: "1200px",
};

const wholeCardStyle = {
  display: "flex",
  flexDirection: "column",
  height: "400px",
  width: "350px",
  borderRadius: "10px",
  boxShadow:
    "rgba(228, 76, 76, 0.1) 0px 4px 10px, rgba(230, 64, 64, 0.1) 3px 8px 10px, rgba(236, 40, 59, 0.1) 0px 16px 56px",
};

const topStyle = {
  color: "white",
  backgroundColor: "rgba(255, 0, 0, 0.72)",
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
  paddingLeft: "15px",
};

const rightStyle = {
  ...leftRightCommonStyle,
  backgroundColor: "rgb(246, 255, 243)",
  borderRadius: "0 0 10px 0",
};

const btnStyle = {
  backgroundColor: "red",
  color: "white",
  padding: "2px",
  border: "none",
  height: "40px",
  width: "150px",
  fontSize: "1rem",
  borderRadius: "10px",
  opacity: "0.6",
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
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={20}
        slidesPerView={3}
        loop={true}
        style={{ padding: "10px 0" }}
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
              <div style={topStyle}>{product.drugName}</div>
              <div style={mainStyle}>
                <div style={leftRightCommonStyle}>
                  <b>Regular</b>
                  <img
                    src={product.imageUrl || "default-image.jpg"}
                    alt="Tablet"
                    style={{ height: "80px", width: "100px" }}
                  />
                  <b>{product.drugName}</b>
                  <p>{product.manufacturer}</p>
                  <p>{product.category}</p>
                  <p>MRP: ₹{product.mrp}</p>
                  <b style={{ color: "rgb(12, 159, 12)" }}>₹{product.price}</b>
                </div>
                <div style={rightStyle}>
                  <b>Recommended</b>
                  {product.alternateMedicines?.map((alt, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        setSelectedVariant({ ...selectedVariant, [product._id]: index })
                      }
                    >
                      <img
                        src={alt.manufacturerUrl || "default-image.jpg"}
                        alt="Tablet"
                        style={{ height: "80px", width: "100px" }}
                      />
                      <b>{alt.name}</b>
                      <p>{alt.manufacturer}</p>
                      <b style={{ color: "rgb(12, 159, 12)" }}>₹{alt.price}</b>
                    </div>
                  ))}
                  <button
                    style={btnStyle}
                    onClick={() => handleAddToCart(product._id, selectedVariant[product._id])}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MedicineCarousel;
