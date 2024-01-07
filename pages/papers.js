import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getPapers } from '../lib/papers';
import { format } from 'date-fns';
import { authors } from '../utils/constants';


export default function Papers({ allPapers }) {
  // Check if the allPapers object has the expected structure
  if (!allPapers || !allPapers.response || !allPapers.response.docs) {
    // Handle the case where the data structure is unexpected or there's an error
    return (
      <div id="papers">
        <Layout home>
          <section className={`${utilStyles.headingSecond} ${utilStyles.padding1px}`}>
            <h2 className={utilStyles.headingLg}>Featured Research</h2>
            <p>Error fetching data from the API. Please try again later.</p>
          </section>
        </Layout>
      </div>
    );
  }

  // If the data structure is as expected, proceed to render the content
  return (
    <div id="papers">
      <Layout home>
        <section className={`${utilStyles.headingSecond} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Featured Research</h2>
          <ul className={utilStyles.list}>
            {allPapers.response.docs.map(item => (
              <li className={utilStyles.listItem} key={item.id}>
                <strong>Title: </strong>
                <a href={`https://ui.adsabs.harvard.edu/abs/${item.bibcode}`}
                target="_blank" rel="noopener noreferrer">{item.title}</a>
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
