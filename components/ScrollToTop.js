// ScrollToTop.js
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/utils.module.css'; // Import the styles

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setIsVisible(scrollY > 100); // Adjust the threshold as needed
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.div
      className={`${styles.scrollToTop} ${isVisible ? styles.visible : ''}`}
      onClick={scrollToTop}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
    >
      ↑
    </motion.div>
  );
};

export default ScrollToTop;
