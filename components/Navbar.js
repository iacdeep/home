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
      <div className="brand-pair">
        <a href={`#${brandLink.to}`} className="brand-link" aria-label="IA2 — back to top">
          <img src={`${basePath}/images/ia2-logo.svg`} alt="IA²" width="72" height="72" />
        </a>
        <span className="brand-divider" aria-hidden="true" />
        <a href="https://www.iac.es/" className="brand-link" aria-label="Instituto de Astrofísica de Canarias" target="_blank" rel="noopener noreferrer">
          <img src={`${basePath}/images/iac-logo.svg`} alt="Instituto de Astrofísica de Canarias (IAC)" width="80" height="80" />
        </a>
      </div>

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

        .right-nav {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .brand-pair {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-shrink: 0;
        }

        .brand-link { display: inline-flex; border-radius: 8px; }
        .brand-link img { display: block; object-fit: contain; }
        .brand-link:focus-visible { outline: 2px solid #70dfcf; outline-offset: 6px; }
        .brand-divider { height: 48px; width: 1px; background: rgba(255,255,255,.4); }

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
