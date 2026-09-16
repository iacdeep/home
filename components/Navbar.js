// Navbar.js
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { useRouter } from 'next/router';


const Navbar = ({ links }) => {
  const { basePath } = useRouter();

  const brandLink = links.find((link) => link.brand);

  const otherLinks = links.filter((link) => !link.brand);

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
            listStyle: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={`${basePath}/images/logo_color.png`}
            alt=""
            style={{ width: '50px', height: '50px', marginRight: '10px' }}
          />
          <ScrollLink
            activeClass="active"
            to={brandLink.to}
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
          >
            {brandLink.text}
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
          flex-wrap: wrap;
          gap: 1.25rem;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.0);
          color: white;
          max-width: 1200px;
          margin: auto;
        }

        .left-nav,
        .right-nav {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .right-nav {
          flex-wrap: wrap;
          gap: 1rem 2rem;
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
            width: 100%;
            text-align: center;
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
