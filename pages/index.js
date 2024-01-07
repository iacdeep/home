// pages/index.js
import About from './about';
import Papers from './papers';
import Members from './members';
import Meetings from './meetings';

import ScrollToTop from '../components/ScrollToTop';
import Navbar from '../components/Navbar';
import { getPapers } from '../lib/papers';
import { Link as ScrollLink } from 'react-scroll';
import Layout, { siteTitle } from '../components/layout';
import Head from 'next/head';
import utilStyles from '../styles/utils.module.css';
import Image from 'next/image';
import { authors } from '../utils/constants';
import { motion } from 'framer-motion';

export async function getStaticProps() {
  const allPapers = await getPapers();
  return {
    props: {
	    allPapers,
    },
  };
}


export default function Home({ allPapers }) {

  const links = [
    { text: 'IACDEEP - Machine learning group at IAC', to: '' },
    { text: 'ABOUT', to: 'about' },
    { text: 'TEAM MEMBERS', to: 'members' },
    { text: 'MEETINGS', to: 'meetings' },
    { text: 'FEATURED RESEARCH', to: 'papers' },
  ];

  return (
    <div>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <Navbar links={links} />

      <div id="title" className="background-container">
        <Layout home>
          <motion.div initial="hidden" animate="visible" variants={{
            hidden: {
              scale: 0.8,
              opacity: 0
            },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.4
              }
            },
          }}>
            <h1>IACDEEP - <br/> Machine Learning Group at IAC</h1>
          </motion.div>
        </Layout>
      </div>

      <About />
      <Members />
      <Meetings />
      <Papers allPapers={allPapers} />

      <ScrollToTop />

      <style jsx>{`
        .background-container {
          background-image: url('../public/images/background.jpg'); /* Update the path to your image */
          background-size: cover;
          background-position: top;
          background-repeat: no-repeat;
          display: flex;
          color: white;
          flex-direction: column;
          justify-content: flex-start; /* Change to move content higher up */
          align-items: center;
          text-align: center;
          max-width: 1000px;
          margin: auto;
          padding: 20px;
          //box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius: 100px;
          font-size: 2.5rem;
          margin-bottom: 0; /* Reduce or remove margin-bottom */
        }

        ul {
          list-style: none;
          padding: 0;
          display: flex;
          justify-content: center;
        }

        a {
          color: white;
          text-decoration: none;
        }

        /* Media Query for Small Screens (e.g., Mobile) */
        @media only screen and (max-width: 800px) {
          .background-container {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};