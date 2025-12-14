import React from "react";
import { Link } from "react-router-dom";
import Container from "../Container";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { colors, isDark } = useTheme();

  return (
    <>
      <footer className={`mt-16 text-center text-sm ${colors.text.muted}`}>
        <Container>
          <div className="px-2 flex flex-wrap justify-center gap-3 md:gap-4 text-xs my-2 ">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/projects" className="hover:underline">
              Projects
            </Link>
            <Link to="/educations" className="hover:underline">
              Education
            </Link>
            <Link to="/work-experiences" className="hover:underline">
              Work
            </Link>
            <Link to="/references" className="hover:underline">
              Recommendations
            </Link>
            <Link to="/blogs" className="hover:underline">
              Blog
            </Link>
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </Container>
      </footer>

      <div
        className={`text-center text-[10px] md:text-sm py-1 mt-1 ${
          isDark ? colors.background.primary : "bg-gray-200"
        } ${colors.text.muted}`}
      >
        © {new Date().getFullYear()} Paing Hein Thet Mon — All rights reserved.
      </div>
    </>
  );
};

export default Footer;