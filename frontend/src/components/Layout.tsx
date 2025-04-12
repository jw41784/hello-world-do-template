import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect } from 'react';

const Layout = () => {
  // Force font loading and apply styles immediately
  useEffect(() => {
    // Apply direct styles to body element
    document.body.style.fontFamily = "'Outfit', sans-serif";
    document.body.style.backgroundColor = "#fefcfa";
    document.body.style.color = "#292524";
    document.body.style.letterSpacing = "0.01em";
    
    // Make sure Tailwind classes are applied
    document.body.classList.add('font-outfit', 'bg-[#fefcfa]', 'text-[#292524]');
    
    // Apply special class and direct styles for headings
    const applyFontToHeadings = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        heading.classList.add('font-cormorant');
        heading.style.fontFamily = "'Cormorant Garamond', serif";
        heading.style.letterSpacing = "0.01em";
      });
    };
    
    // Apply styles to elements with specific classes
    const applyComponentStyles = () => {
      // Apply button styles
      document.querySelectorAll('.btn-primary, .btn-secondary, .btn-danger').forEach(btn => {
        btn.classList.add('transition-all', 'duration-300', 'rounded-lg', 'hover:scale-[1.03]');
      });
      
      // Apply card styles
      document.querySelectorAll('.card').forEach(card => {
        card.classList.add('transition-all', 'duration-300', 'rounded-xl', 'hover:scale-[1.01]', 'hover:shadow-lg');
      });
      
      // Apply rating star styles
      document.querySelectorAll('.rating-star').forEach(star => {
        star.classList.add('transition-all', 'duration-200', 'hover:scale-110', 'hover:rotate-12');
      });
    };
    
    // Call immediately
    applyFontToHeadings();
    applyComponentStyles();
    
    // Load external styles with cache-busting
    const loadExternalStyles = () => {
      // Create a new link element with unique timestamp
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      const timestamp = Date.now();
      linkElement.href = `/custom-styles.css?v=${timestamp}`;
      document.head.appendChild(linkElement);
    };
    
    // Load external styles
    loadExternalStyles();
    
    // Also set up a mutation observer to catch dynamically added elements
    const observer = new MutationObserver(() => {
      applyFontToHeadings();
      applyComponentStyles();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fefcfa]">
      <Navbar />
      <main className="flex-grow page-container pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;