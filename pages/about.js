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
            The IAC-DEEP group is dedicated to the development and application of machine learning (ML), deep learning (DL), and artificial intelligence (AI) techniques for the analysis and interpretation of astrophysical data and beyond. Our research covers a broad range of topics, from solar physics to galaxy evolution and cosmology expanding to bio-medicine projects.
          </p>
          <p>
            Our group is engaged both in national and international level projects and collaboration. We have access to state-of-the-art computational facilities in Spain and internationally, enabling us to tackle complex astrophysical problems with cutting-edge machine learning techniques. Our team includes key members and leading contributors in major astronomical collaborations such as Euclid, DESI, and JWST, where we play an active role in data analysis and scientific exploration.
          </p>
          <p>
            By integrating advanced computational techniques with observational and theoretical astrophysics, we aim to optimize data processing, refine predictive models, and uncover new insights from large astronomical datasets and simulations, pushing the frontiers of modern astrophysics.
          </p>
        </section>
      </Layout>
    </div>
  );
}
