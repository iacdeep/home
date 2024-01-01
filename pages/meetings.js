import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';

export default function Meetings() {
  return (
    <div id="meetings"> {/* Add the id attribute here */}
      <Layout home>
        {/* Add the Image component here */}
        <h2 className={utilStyles.headingLg}>Meetings</h2>
        <div className="responsive-iframe">
        <iframe
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSOG3qUlK87cqUNnrQuKIHNU0pl2HNVE6iSyUgnnH5SYjG0pMCnxt11ysdtDgcSq2GS7m-68lP-gPqe/pubhtml?gid=0&single=true&widget=true&headers=false&chrome=false"
          title="Google Sheets Document"
          frameBorder="0"
          width="100%"
          height="600"
          allowFullScreen
        ></iframe>
      </div>
      </Layout>

      <style jsx>{`
        .responsive-iframe {
            class: "styled-table";
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 0.9em;
            font-family: sans-serif;
            min-width: 400px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        }
        .responsive-iframe tbody tr {
            border-bottom: 1px solid #dddddd;
        }

        .responsive-iframe tbody tr:nth-of-type(even) {
            background-color: #f3f3f3;
        }

        .responsive-iframe tbody tr.active-row {
            font-weight: bold;
            color: #009879;
        }


        td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
      `}</style>

    </div>
  );
}