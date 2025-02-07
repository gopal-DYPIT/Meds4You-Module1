import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);

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

  // Updated responsive items to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(2); // Show 2 items on mobile instead of 1
      } else if (window.innerWidth < 768) {
        setItemsToShow(3);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(3);
      } else {
        setItemsToShow(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(3); // ✅ Show 3 categories on mobile instead of 2
      } else if (window.innerWidth < 768) {
        setItemsToShow(3);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(3);
      } else {
        setItemsToShow(4);
      }
    };

    handleResize(); // Call once on mount to set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex + itemsToShow < categories.length;

  const handlePrevious = () => {
    if (canScrollLeft) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (canScrollRight) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const visibleCategories = categories.slice(
    currentIndex,
    currentIndex + itemsToShow
  );

  
  

  return (
    <div className="flex justify-center items-center min-h-[80px] w-full px-2 pr-8 sm:px-4 sm:min-h-[100px]">
      <div className="w-full max-w-3xl sm:max-w-6xl sm:pr-10 mx-auto">
        <div className="relative flex items-center justify-between space-x-1 sm:space-x-2 md:space-x-4 bg-[#f0f8ff] p-2 sm:p-3 md:p-4 rounded-xl shadow-md">
          {/* Left Arrow */}
          <button
            className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white shadow-md transition-all duration-200 flex-shrink-0 ${
              canScrollLeft
                ? "hover:bg-gray-100 text-gray-700"
                : "opacity-50 cursor-not-allowed text-gray-400"
            }`}
            onClick={handlePrevious}
            disabled={!canScrollLeft}
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>

          {/* Category Container */}
          <div className="flex justify-center space-x-1 sm:space-x-2 md:space-x-3 flex-1">
            {visibleCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`
                  px-2 py-1 
                  sm:px-3 sm:py-1.5 
                  md:px-4 md:py-2
                  rounded-lg 
                  font-medium 
                  text-[10px]
                  sm:text-xs 
                  md:text-sm
                  whitespace-nowrap 
                  transition-all 
                  duration-200 
                  transform 
                  hover:scale-105 
                  flex-1
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-offset-2
                  ${
                    selectedCategory === category.value
                      ? "bg-[#d7548c] text-white shadow-md focus:ring-[#419ec8]"
                      : "bg-white text-gray-700 shadow-md hover:bg-[#75c6eb] focus:ring-gray-400"
                  }
                `}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white shadow-md transition-all duration-200 flex-shrink-0 ${
              canScrollRight
                ? "hover:bg-gray-100 text-gray-700"
                : "opacity-50 cursor-not-allowed text-gray-400"
            }`}
            onClick={handleNext}
            disabled={!canScrollRight}
            aria-label="Next categories"
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;