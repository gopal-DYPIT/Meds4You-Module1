import React from "react";
import { useEffect, useState } from "react";

const HomeAdvantageSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index); // Toggle answer visibility
  };
  const newsItems = [
    {
      img: "https://www.platinumrx.in/assets/Icons/LandingPage/News-Section/news1.png?w=640&q=80",
      title: "News Title 1",
      link: "https://www.outlookbusiness.com/corporate/platinumrx-secures-800000-funding-led-by-indiaquotient",
    },
    {
      img: "https://www.platinumrx.in/assets/Icons/LandingPage/News-Section/news2.png?w=640&q=80",
      title: "News Title 2",
      link: "https://www.outlookbusiness.com/corporate/platinumrx-secures-800000-funding-led-by-indiaquotient",
    },
    {
      img: "https://www.platinumrx.in/assets/Icons/LandingPage/News-Section/news3.png?w=640&q=80",
      title: "News Title 3",
      link: "https://www.outlookbusiness.com/corporate/platinumrx-secures-800000-funding-led-by-indiaquotient",
    },
    {
      img: "https://www.platinumrx.in/assets/Icons/LandingPage/News-Section/news4.png?w=640&q=80",
      title: "News Title 4",
      link: "https://indianstartuptimes.com/investment/platinumrx-secures-800k-funding-led-by-indiaquotient-to-revolutionize-chronic-medication-access/?amp=1",
    },
    {
      img: "https://www.platinumrx.in/assets/Icons/LandingPage/News-Section/news5.png?w=640&q=80",
      title: "News Title 5",
      link: "https://www.bizzbuzz.news/markets/healthtech-startup-platinumrx-raises-800000-in-seed-round-1305545#google_vignette",
    },
    {
      img: "https://www.platinumrx.in/assets/Icons/LandingPage/News-Section/news6.png?w=640&q=80",
      title: "News Title 6",
      link: "https://www.bizzbuzz.news/markets/healthtech-startup-platinumrx-raises-800000-in-seed-round-1305545#google_vignette",
    },
    {
      img: "https://www.platinumrx.in/assets/Icons/LandingPage/News-Section/news7.png?w=640&q=80",
      title: "News Title 7",
      link: "https://www.vccircle.com/planystechnologies-platinumrx-secure-early-stage-funding",
    },
  ];
  return (
    <>
      <section style={{ padding: "30px" }}>
        <h2 style={{ textAlign: "center", color: "#FF5C5C" }}>
          The MedicineShop Advantage
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {[].map((product, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                width: "300px",
              }}
            ></div>
          ))}
        </div>
      </section>

      {/* Advantage card Section */}
      <section style={{ padding: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "48%", // Adjusted to give 50% space with gap
              height: "auto",
            }}
          >
            <img
              src="https://www.platinumrx.in/_next/static/media/thumbnail.493b234e.png?w=3840&q=80"
              alt="Image 1"
              style={{
                width: "100%", // Makes image fill the container
                height: "auto", // Maintains aspect ratio
                borderRadius: "10px",
              }}
            />
          </div>
          <div
            style={{
              width: "48%", // Adjusted to give 50% space with gap
              height: "auto",
            }}
          >
            <img
              src="https://www.platinumrx.in/_next/static/media/sidebanner.83189627.png?w=3840&q=80"
              alt="Image 2"
              style={{
                width: "100%", // Makes image fill the container
                height: "auto", // Maintains aspect ratio
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
      </section>

      {/* Top Chronic Categories Section */}
      <section style={{ padding: "30px 0" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "left",
            marginBottom: "20px",
          }}
        >
          👍Top Chronic Categories
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {[
            {
              title: "Diabetes",
              image:
                "https://cdn-platinumrx.azureedge.net/platinumrx-assets/category-diabetes1.png?w=384&q=80",
            },
            {
              title: "Digestive Care",
              image:
                "https://cdn-platinumrx.azureedge.net/platinumrx-assets/category-digestive-care1.png?w=384&q=80",
            },
            {
              title: "Heart Care",
              image:
                "https://cdn-platinumrx.azureedge.net/platinumrx-assets/category-heart-care1.png?w=384&q=80",
            },
            {
              title: "Respiratory Care",
              image:
                "https://cdn-platinumrx.azureedge.net/platinumrx-assets/category-respiratory-care1.png?w=384&q=80",
            },
            {
              title: "Kidney & Liver Care",
              image:
                "https://cdn-platinumrx.azureedge.net/platinumrx-assets/category-kideny-and-liver1.png?w=384&q=80",
            },
            {
              title: "Joints and Muscle Care",
              image:
                "https://cdn-platinumrx.azureedge.net/platinumrx-assets/category-joints-and-muscle1.png?w=384&q=80",
            },
          ].map((category, index) => (
            <div
              key={index}
              style={{
                textAlign: "center",
                flex: "1 1 calc(16.66% - 10px)", // This ensures 6 images fit in one row
                maxWidth: "calc(16.66% - 10px)", // Ensures the width stays fixed even when resized
              }}
            >
              <img
                src={category.image}
                alt={category.title}
                style={{
                  width: "100%", // Makes image fill the container
                  height: "auto", // Maintains aspect ratio
                  objectFit: "cover", // Ensures the image does not get distorted
                  borderRadius: "5px", // Adds rounded corners if needed
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional shadow
                }}
              />
              <p>{category.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NewsItem Section */}
      <section style={{ padding: "30px", backgroundColor: "#FFF" }}>
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "24px",
            marginBottom: "20px",
            textAlign: "left",
          }}
        >
          We Are in News
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "nowrap",
          }}
        >
          {newsItems.map((news, index) => (
            <a
              key={index}
              href={news.link}
              target="_blank" // Ensures the link opens in a new tab
              style={{
                position: "relative",
                width: "130px", // Small size to fit in one line
                textDecoration: "none", // No underline on links
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Image */}
              <img
                src={news.img}
                alt={news.title}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />

              {/* Hover Overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "#FFF",
                  opacity: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "opacity 0.3s",
                  padding: "10px",
                  textAlign: "center",
                }}
                className="hover-overlay"
              >
                <h3 style={{ marginBottom: "10px", fontSize: "14px" }}>
                  {news.title}
                </h3>
                <span
                  style={{
                    backgroundColor: "#FFC107",
                    color: "#000",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }}
                >
                  Read More
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Top Brands Section */}
      <section style={{ padding: "30px", backgroundColor: "#FFF" }}>
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "24px",
            marginBottom: "20px",
            textAlign: "left",
          }}
        >
          ⭐Our top brands
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "1 1 calc(16.66% - 10px)",
              maxWidth: "calc(16.66% - 10px)",
            }}
          >
            <img
              src="https://www.platinumrx.in/_next/static/media/brand1.3704a89b.png?w=1920&q=80"
              alt="Brand 1"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "5px",
              }}
            />
          </div>

          <div
            style={{
              flex: "1 1 calc(16.66% - 10px)",
              maxWidth: "calc(16.66% - 10px)",
            }}
          >
            <img
              src="https://www.platinumrx.in/_next/static/media/brand2.92aa84cd.png?w=1920&q=80"
              alt="Brand 2"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "5px",
              }}
            />
          </div>

          <div
            style={{
              flex: "1 1 calc(16.66% - 10px)",
              maxWidth: "calc(16.66% - 10px)",
            }}
          >
            <img
              src="https://www.platinumrx.in/_next/static/media/brand3.1dd9fdd6.png?w=1920&q=80"
              alt="Brand 3"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "5px",
              }}
            />
          </div>

          <div
            style={{
              flex: "1 1 calc(16.66% - 10px)",
              maxWidth: "calc(16.66% - 10px)",
            }}
          >
            <img
              src="https://www.platinumrx.in/_next/static/media/brand5.da8f9a03.png?w=1920&q=80"
              alt="Brand 4"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "5px",
              }}
            />
          </div>

          <div
            style={{
              flex: "1 1 calc(16.66% - 10px)",
              maxWidth: "calc(16.66% - 10px)",
            }}
          >
            <img
              src="https://www.platinumrx.in/_next/static/media/brand6.e6aeade4.png?w=1920&q=80"
              alt="Brand 5"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "5px",
              }}
            />
          </div>

          <div
            style={{
              flex: "1 1 calc(16.66% - 10px)",
              maxWidth: "calc(16.66% - 10px)",
            }}
          >
            <img
              src="https://www.platinumrx.in/_next/static/media/brand7.246474a2.png?w=1920&q=80"
              alt="Brand 6"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "5px",
              }}
            />
          </div>
        </div>
      </section>

      {/* PlatinumRx Info Section */}
      <section
        style={{
          padding: "30px",
          backgroundColor: "#F8F8F8", // Lighter gray background
        }}
      >
        <h2
          style={{
            fontWeight: "bold", // Bold text
            textAlign: "left", // Left align the title
            marginBottom: "10px",
          }}
        >
          PlatinumRx.in: Your Preferred Online Pharmacy!
        </h2>
        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            textAlign: "left", // Align to the left
            fontWeight: "normal", // Regular weight for body text
            marginBottom: "15px",
          }}
        >
          Empowering you with the best medicine choices at unbeatable prices.
          Breaking barriers in healthcare, we're not just another e-pharmacy;
          we're a movement towards informed, cost-effective health solutions.
          PlatinumRx’s substitution engine helps consumers find the exact
          substitute medicine having the same salt, same strength, and
          absolutely same effectiveness at a fraction of cost.
        </p>

        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            textAlign: "left", // Align to the left
            marginBottom: "15px",
          }}
        >
          <strong>
            PlatinumRx.in stands as India's leading online chemist
          </strong>
          , offering substitute medicines for over 2 lakh medicines at the most
          competitive prices. We serve as your ultimate destination for various
          healthcare products, including over-the-counter pharmaceuticals.
        </p>

        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            textAlign: "left", // Align to the left
            marginBottom: "15px",
          }}
        >
          With <strong>PlatinumRx.in</strong>, purchasing medicines online and
          receiving doorstep delivery anywhere in India is hassle-free! Worried
          about the complexity of ordering medicines online? Fear not! At
          PlatinumRx, the best online pharmacy, simply search for your desired
          products, and add the curated substitute medicine to your cart, and
          proceed to checkout. Sit back and relax as we ensure prompt delivery
          of your order.
        </p>

        <p
          style={{
            fontWeight: "normal", // Regular weight
            fontSize: "18px",
            lineHeight: "1.6",
            textAlign: "left", // Align to the left
            marginBottom: "15px",
          }}
        >
          Should you require any assistance, feel free to give us a call or send
          us a message on Whatsapp, and our dedicated team of experts will guide
          you through the order process.
        </p>

        <p
          style={{
            fontWeight: "normal", // Regular weight
            fontSize: "18px",
            lineHeight: "1.6",
            textAlign: "left", // Align to the left
            marginBottom: "15px",
          }}
        >
          We've expanded our reach across India! From being the best online
          pharmacy in Bangalore, we now provide delivery services in over 1000
          cities and towns spanning 22000+ pin codes, we've ensured coverage in
          every part of the country. Major cities like Mumbai, Kolkata, Delhi,
          Bengaluru, Ahmedabad, Hyderabad, Chennai, Thane, Howrah, Pune,
          Gurgaon, Navi Mumbai, and Kochi are already getting doorstep delivery
          from us.
        </p>

        <p
          style={{
            fontWeight: "normal", // Regular weight
            fontSize: "18px",
            lineHeight: "1.6",
            textAlign: "left", // Align to the left
            marginBottom: "15px",
          }}
        >
          Is it not convenient? Why bother with trips to the pharmacy and
          waiting in line when PlatinumRx.in Pharmacy is at your beck and call?
        </p>
      </section>

      {/* Frequently Asked Questions Section */}
      <section style={{ padding: "30px", backgroundColor: "#FFF" }}>
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            marginBottom: "20px",
            textAlign: "left",
          }}
        >
          Frequently Asked Questions
        </h2>

        {/* FAQ Question 1 */}
        <div
          style={{
            marginBottom: "10px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <div
            onClick={() => toggleFAQ(0)}
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            <span>How to order medicine on PlatinumRx?</span>
            <span>{openFAQ === 0 ? "↑" : "↓"}</span>
          </div>

          {/* Answer for FAQ 1 */}
          {openFAQ === 0 && (
            <p
              style={{
                marginTop: "10px",
                fontSize: "16px",
                lineHeight: "1.6",
                color: "gray",
                textAlign: "left",
              }}
            >
              On PlatinumRx.in, either search for the medicine that’s been
              prescribed to you or upload the prescription. You can also call us
              at +91 96069 73756. We will recommend the best substitute for you
              to order. Enter the patient’s details and your shipping address.
              Upload new prescriptions or choose from past prescriptions. If you
              do not have a prescription, you receive a free tele-consultation
              from us. Choose a suitable payment method. It’s that simple.
            </p>
          )}
        </div>

        {/* FAQ Question 2 */}
        <div
          style={{
            marginBottom: "10px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <div
            onClick={() => toggleFAQ(1)}
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            <span>Is substitute medicine safe to consume?</span>
            <span>{openFAQ === 1 ? "↑" : "↓"}</span>
          </div>
          {/* Answer for FAQ 2 */}
          {openFAQ === 1 && (
            <p
              style={{
                marginTop: "10px",
                fontSize: "16px",
                lineHeight: "1.6",
                color: "gray",
                textAlign: "left",
              }}
            >
              In a word, yes. Substitute medicines are safe and as effective as
              branded medicines. They contain the same drug salts and are
              manufactured according to the same quality standards as all other
              medicines. The medicine manufacturing facilities are WHO-GMP
              certified. Good Manufacturing Practice (GMP) ensures only good
              quality products are manufactured. At PlatinumRx, we only have
              branded substitutes from top brands like Cipla, Abbott, etc.
            </p>
          )}
        </div>

        {/* FAQ Question 3 */}
        <div
          style={{
            marginBottom: "10px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <div
            onClick={() => toggleFAQ(2)}
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            <span>Why is substitute medicine cheaper?</span>
            <span>{openFAQ === 2 ? "↑" : "↓"}</span>
          </div>

          {/* Answer for FAQ 3 */}
          {openFAQ === 2 && (
            <p
              style={{
                marginTop: "10px",
                fontSize: "16px",
                lineHeight: "1.6",
                color: "gray",
                textAlign: "left",
              }}
            >
              PlatinumRx cuts out the middlemen and sources directly from
              distributors/manufacturers to get the best possible deal.
            </p>
          )}
        </div>

        {/* FAQ Question 4 */}
        <div
          style={{
            marginBottom: "10px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <div
            onClick={() => toggleFAQ(3)}
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            <span>How to choose the right substitute medicine for myself?</span>
            <span>{openFAQ === 3 ? "↑" : "↓"}</span>
          </div>

          {/* Answer for FAQ 4 */}
          {openFAQ === 3 && (
            <p
              style={{
                marginTop: "10px",
                fontSize: "16px",
                lineHeight: "1.6",
                color: "gray",
                textAlign: "left",
              }}
            >
              Choosing the right substitute medicine from the sea of medicines
              can get overwhelming. However, we have curated the best substitute
              medicine per salt for you.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default HomeAdvantageSection;
