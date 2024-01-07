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
        <div>
          <Navbar links={links} />

          <div>
            {/* Your content goes here */}
          </div>
        </div>

      <div id="title"> {/* Add the id attribute here */}
       <Layout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>

        <section className={utilStyles.headingMd}>
        <motion.div initial="hidden" animate="visible" variants={{
          hidden: {
            scale: .8,
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
        </section>

       </Layout>
      </div>

      <About />
      <Members />
      <Meetings />
      <Papers allPapers={allPapers} />

      <ScrollToTop />

      <style jsx>{`
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

        section {
          padding: 2rem;
          margin-top: 80px; /* Adjust based on the navbar height */
        }
      `}</style>
    </div>
  );
};
