// Navbar.js
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { useRouter } from 'next/router';


const Navbar = ({ links }) => {
  const router = useRouter();

  const iacdeepLink = links.find((link) => link.text.startsWith('IACDEEP'));

  const otherLinks = links.filter((link) => !link.text.startsWith('IACDEEP'));

  const handleIACDEEPLinkClick = () => {
    // Conditionally reload the page only if the link is not the "about" section
    if (iacdeepLink.to !== 'about') {
      router.reload();
    }
  };

  return (
    <nav className="navbar">
      <ul className="left-nav">
        <motion.li
          whileHover={{
            scale: 1.2,
            transition: {
              duration: 0.2,
            },
          }}
          style={{
            marginRight: '20px',
            listStyle: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="images/logo_color.png"
            alt="Logo"
            style={{ width: '50px', height: '50px', marginRight: '10px' }}
          />
          <ScrollLink
            activeClass="active"
            to={iacdeepLink.to}
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="nav-link"
            style={{
              color: 'white',
              fontWeight: 'bold',
              textDecoration: 'none',
              fontSize: '1.4em',
              verticalAlign: 'middle',
            }}
            onClick={handleIACDEEPLinkClick}
          >
            {iacdeepLink.text}
          </ScrollLink>
        </motion.li>
      </ul>

      <ul className="right-nav">
        {otherLinks.map((link, index) => (
          <motion.li
            key={index}
            whileHover={{
              scale: 1.2,
              transition: {
                duration: 0.2,
              },
            }}
            style={{
              marginRight: index < otherLinks.length - 1 ? '50px' : '0',
              listStyle: 'none',
            }}
          >
            <ScrollLink
              activeClass="active"
              to={link.to}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="nav-link"
              style={{
                color: 'white',
                fontWeight: 'bold',
                textDecoration: 'none',
                fontSize: '1em',
                verticalAlign: 'middle',
              }}
            >
              {link.text}
            </ScrollLink>
          </motion.li>
        ))}
      </ul>

      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.0);
          color: white;
          margin-left: 75px;
          margin-right: 25px;
        }

        .left-nav,
        .right-nav {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-link {
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            align-items: center;
            margin-left: 10px;
            margin-right: 10px;
          }

          .left-nav,
          .right-nav {
            flex-direction: column;
            align-items: center;
            width: 100%; // Set width to 100% for proper alignment
            text-align: center; // Center the text on mobile
          }

          .nav-link {
            margin-bottom: 10px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
