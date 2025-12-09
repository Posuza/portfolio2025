import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronRight, FiHome } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const Breadcrumb = ({ currentPage, links = [], productId = null }) => {
  const { colors, isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-wrap items-center justify-between text-xs sm:text-sm gap-1">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center flex-wrap">
          {links.map((link, index) => (
            <React.Fragment key={link.path}>
              <li className="inline-flex items-center">
                <Link
                  to={link.path}
                  className={`font-sm md:font-medium inline-flex items-center ${colors.text.secondary} hover:text-sky-600 transition-colors`}
                >
                  {link.title}
                </Link>
              </li>
              <li className="md:mx-2">
                <FiChevronRight className={`${colors.text.muted}`} size={13} />
              </li>
            </React.Fragment>
          ))}
          <li>
            <span className={`font-sm md:font-medium ${colors.text.primary} truncate max-w-[120px] sm:max-w-[200px]`}>
              {currentPage}
            </span>
          </li>
        </ol>
      </nav>
      
      {/* Product detail link with right arrow */}
      {productId && (
        <button 
          onClick={() => navigate(`/products/${productId}`)}
          className={`flex items-center ${colors.text.secondary} hover:text-sky-600 transition-colors text-xs sm:text-sm font-medium`}
          title="View product details"
        >
          View Details
          <FiChevronRight className="ml-1" size={15} />
        </button>
      )}
    </div>
  );
};

export default Breadcrumb;