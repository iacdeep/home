import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
//import { getSortedPostsData } from '../lib/posts';
import { getPapers } from '../lib/papers';
import { format } from 'date-fns';
import { authors } from '../utils/constants';


export async function getStaticProps() {
  // Make parallel requests for each author
  const promises = authors.map(async author => {
    const papers = await getPapers(author);
    return papers.response.docs;
  });

  // Wait for all promises to resolve
  const results = await Promise.all(promises);

  // Combine the results by date (you might need to adjust this based on the actual structure of your data)
  const combinedPapers = results.flat().sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    props: {
      allPapers: { response: { docs: combinedPapers } }, // Adjust the structure if needed
    },
  };
}


export default function Papers({ allPapers }) {
  return (
    <div id="papers"> {/* Add the id attribute here */}
    <Layout home>
     <section className={`${utilStyles.headingSecond} ${utilStyles.padding1px}`}>
      <h2 className={utilStyles.headingLg}>Featured Research</h2>
      <ul className={utilStyles.list}>
        {allPapers.response.docs.map(item => (
          <li className={utilStyles.listItem} key={item.id}>
            <strong>Title: </strong>
            <a href={`https://ui.adsabs.harvard.edu/abs/${item.bibcode}`} target="_blank" rel="noopener noreferrer">{item.title}</a>
            <br />
            <strong>Authors:</strong> {item.author.slice(0, 4).join(', ')}
                {item.author.length > 4 && <span> and {item.author.length - 4} more</span>}
            <br />
            <strong>Date:</strong> { format(new Date(item.date), 'yyyy-MM-dd') }
          </li>
        ))}
      </ul>
    </section>
	  
     </Layout>
    </div>
  );
}

