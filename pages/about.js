import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import Image from 'next/image';

export default function About() {
  return (
    <div id="about"> {/* Add the id attribute here */}
      <Layout home>
        {/* Add the Image component here */}
        <section className={utilStyles.headingSecond}>
          <h2 className={utilStyles.headingLg}>About</h2>

          <p>
            At IAC-Deep, we work with and develop AI approaches to analyze and interpret
            astrophysical data, from solar physics to cosmology.
          </p>
        </section>
      </Layout>
    </div>
  );
}