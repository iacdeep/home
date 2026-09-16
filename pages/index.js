// pages/index.js
import About from './about';
import Papers from './papers';
import Members from './members';
import Meetings from './meetings';

import ScrollToTop from '../components/ScrollToTop';
import Navbar from '../components/Navbar';
import { getPapers } from '../lib/papers';
import Layout, { siteTitle } from '../components/layout';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export async function getStaticProps() {
  const allPapers = await getPapers();
  return {
    props: {
	    allPapers,
    },
  };
}


export default function Home({ allPapers }) {
  const { basePath } = useRouter();

  const links = [
    { text: 'IA2 · IAC', to: 'title', brand: true },
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

      <header className="hero" style={{
        backgroundImage: `linear-gradient(rgba(9, 24, 47, 0.35), rgba(9, 24, 47, 0.8)), url(${basePath}/images/background.jpg)`,
      }}>
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
              <h1>{siteTitle}</h1>
              <p className="institution">Instituto de Astrofísica de Canarias</p>
            </motion.div>
          </Layout>
        </div>

      </header>

      <About />
      <Members />
      <Meetings />
      <Papers allPapers={allPapers} />

      <ScrollToTop />

      <style jsx>{`
        .hero {
          background-color: #09182f;
          background-size: cover;
          background-position: center;
          color: white;
          overflow: hidden;
        }

        .background-container {
          color: white;
          text-align: center;
          max-width: 1000px;
          margin: auto;
          padding: 1rem 1rem 2rem;
        }

        h1 {
          font-size: clamp(2rem, 5vw, 3.8rem);
          line-height: 1.15;
          overflow-wrap: break-word;
        }

        .institution {
          font-size: 1.1rem;
        }

      `}</style>
    </div>
  );
};