import { useState } from "react";

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: "TopSellers", label: "Top Sellers" }, // Null represents default (no category)
    { value: "Diabetes", label: "Diabetes" },
    {
      value: "Neurological-and-Psychiatric",
      label: "Neurological & Psychiatric",
    },
    { value: "Piles-Fissures-Fistula", label: "Piles, Fissures & Fistula" },
    {
      value: "Reproductive-Health-Wellness",
      label: "Reproductive Health & Wellness",
    },
    { value: "vitamins-and-minerals", label: "Vitamins & Minerals" },
    { value: "skin-care", label: "Skin Care" },
    { value: "heart-care", label: "Heart Care" },
    { value: "digestive-care", label: "Digestive Care" },
    { value: "kidney-care", label: "Kidney Care" },
    { value: "respiratory-care", label: "Respiratory Care" },
    { value: "joints-and-muscle-care", label: "Joints & Muscle Care" },
    { value: "arthritis", label: "Arthritis" },
    { value: "autoimmune-conditions", label: "Autoimmune Conditions" },
    { value: "cancer-care", label: "Cancer Care" },
    { value: "infectious", label: "Infectious Diseases" },
    { value: "liver-care", label: "Liver Care" },
  ];

  return (
    <div className="relative flex justify-start my-4 sm:my-6">
      {/* Filters Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 sm:px-6 sm:py-3 rounded-lg border border-gray-300 shadow-md hover:bg-gray-200 transition"
      >
        <span className="font-medium">Filters</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 6h10M5 12h15m-10 6h10"
          />
        </svg>
      </button>

      {/* Filters Popover (Left-Aligned) */}
      {showFilters && (
        <div className="absolute top-12 left-0 w-72 sm:w-96 bg-white shadow-lg rounded-lg border border-gray-300 p-4 z-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Filter by Category
          </h3>

          

          {/* Category List */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-2">
            {categories
              .filter((category) => category.value !== null) // Exclude "Top Sellers" from the list
              .map((category) => (
                <label
                  key={category.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={selectedCategory === category.value}
                    onChange={() => {
                      setSelectedCategory(category.value);
                      setShowFilters(false);
                    }}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                  <span>{category.label}</span>
                </label>
              ))}
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowFilters(false)}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
