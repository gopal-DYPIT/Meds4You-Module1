import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const categories = [
    { value: "TopSellers", label: "Top Sellers" },
    { value: "Diabetes", label: "Diabetes" },
    { value: "heart-care", label: "Heart Care" },
    { value: "skin-care", label: "Skin Care" },
    { value: "vitamins-and-minerals", label: "Vitamins & Minerals" },
    { value: "Neurological-and-Psychiatric", label: "Neurology & Psychiatry" },
    { value: "Piles-Fissures-Fistula", label: "Piles & Fissures" },
    { value: "Reproductive-Health-Wellness", label: "Reproductive Health" },
    { value: "digestive-care", label: "Digestive Care" },
  ];

  // Handle screen resizing for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      if (window.innerWidth < 480) {
        setItemsToShow(3);
      } else if (window.innerWidth < 768) {
        setItemsToShow(3);
      } else {
        setItemsToShow(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const canScrollLeft = currentIndex > 0;
  let  canScrollRight;
  if(screenWidth < 480) {
    canScrollRight = currentIndex + itemsToShow < categories.length+4;
  } else {
    canScrollRight = currentIndex + itemsToShow < categories.length;
  }

  const handlePrevious = () => {
    if (canScrollLeft) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (canScrollRight) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const visibleCategories = categories.slice(
    currentIndex,
    currentIndex + itemsToShow
  );

  return (
    <div className="flex justify-center pr-6 sm:pr-20 items-center min-h-[80px] w-full px-2 sm:px-8">
      <div className="w-full max-w-3xl sm:max-w-6xl mx-auto">
        <div className="relative flex items-center bg-[#f0f8ff] p-2 sm:p-3 md:p-4 rounded-xl shadow-md">
          {/* Left Arrow */}
          <button
            className={`flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md transition-all duration-200 ${
              canScrollLeft
                ? "hover:bg-gray-100 text-gray-700"
                : "opacity-50 cursor-not-allowed text-gray-400"
            }`}
            onClick={handlePrevious}
            disabled={!canScrollLeft}
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Category Container (Fixed Width & Overflow Hidden) */}
          <div className="flex overflow-hidden w-full mx-2">
            <div
              className="flex transition-transform duration-300 space-x-2"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsToShow)
                }%)`,
                minWidth: "100%",
              }}
            >
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === category.value
                      ? "bg-[#d7548c] text-white shadow-md"
                      : "bg-white text-gray-700 shadow-md hover:bg-[#75c6eb]"
                  }`}
                  style={{
                    flex: `0 0 ${
                      100 / Math.min(itemsToShow, categories.length)
                    }%`,
                  }}
                  // Ensures each button takes equal width
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            className={`flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md transition-all duration-200 ${
              canScrollRight
                ? "hover:bg-gray-100 text-gray-700"
                : "opacity-50 cursor-not-allowed text-gray-400"
            }`}
            onClick={handleNext}
            disabled={!canScrollRight}
            aria-label="Next categories"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
