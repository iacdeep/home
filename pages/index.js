// pages/index.js
import About from './about';
import Papers from './papers';
import Members from './members';
import Meetings from './meetings';

import { getPapers } from '../lib/papers';
import { Link as ScrollLink } from 'react-scroll';
import Layout, { siteTitle } from '../components/layout';
import Head from 'next/head';
import utilStyles from '../styles/utils.module.css';
import Image from 'next/image';
import { authors } from '../utils/constants';


export async function getStaticProps() {
  const allPapers = await getPapers();
  console.log('================', allPapers)
  return {
    props: {
	    allPapers,
    },
  };
}


export default function Home({ allPapers }) {
  return (
    <div>
      <nav>
        <ul>
            <li>
             <ScrollLink
              activeClass="active"
              to="about"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="nav-link"
              style={{ color: 'white', fontWeight: 'bold'}}
            >
              ABOUT
            </ScrollLink>
          </li>
          <li>
            <ScrollLink
              activeClass="active"
              to="members"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="nav-link"
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              TEAM MEMBERS
            </ScrollLink>
          </li>
          <li>
            <ScrollLink
              activeClass="active"
              to="meetings"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="nav-link"
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              MEETINGS
            </ScrollLink>
          </li>
          <li>
            <ScrollLink
              activeClass="active"
              to="papers"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="nav-link"
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              FEATURED RESEARCH
            </ScrollLink>
            </li>
        </ul>
      </nav>

      <div id="about"> {/* Add the id attribute here */}
       <Layout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        {/* Add the Image component here */}
        <section className={utilStyles.headingMd}>
        <h1>IACDEEP - Machine Learning Group at IAC</h1>
        </section>
       </Layout>
      </div>

      <About />
      <Members />
      <Meetings />
      <Papers allPapers={allPapers} />

      <style jsx>{`
        nav {
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.0); /* Transparent white background */
          padding: 1rem;
          z-index: 1000;
        }

        ul {
          list-style: none;
          padding: 0;
          display: flex;
          justify-content: center;
        }

        li {
          margin: 0 1rem;
        }

        .nav-link {
          color: white !important;
          text-decoration: none;
          font-weight: bold;
        }

        a {
          color: white;
          text-decoration: none;
        }

        section {
          padding: 2rem;
          margin-top: 80px; /* Adjust based on the navbar height */
        }
      `}</style>
    </div>
  );
};
