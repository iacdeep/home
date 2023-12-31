import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
//import { getSortedPostsData } from '../lib/posts';
import { getPapers } from '../lib/papers';



//export async function getStaticProps() {
//  const allPostsData = getSortedPostsData();
//  return {
//    props: {
//      allPostsData,
//    },
//  };
//}

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
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>At IAC-Deep we work with and develop AI approaches to
         analyze and interpret astrophysical data, from solar physics to cosmology. </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Papers</h2>
        <ul className={utilStyles.list}>
        {allPapers.response.docs.map(item => (
  	    <li className={utilStyles.listItem} key={item.id}>
    	<strong>Title:</strong> {item.title}
    	<br />
    	<strong>Bibcode:</strong> {item.bibcode}
    	<br />
  	</li>
	))}
      </ul>
      </section>
	  
     </Layout>
  );
}

