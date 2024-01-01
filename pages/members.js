import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import Image from 'next/image';
import { membersData } from '../utils/constants';


export default function Members() {
  return (
    <div id="members">
      <Layout home>
        <h2 className={utilStyles.headingLg}>Team Members</h2>
        <table className="custom-table">
          <tbody>
            {membersData.map((member, index) => (
              <tr key={index}>
                <td><strong>{member.name}</strong></td>
                <td>{member.role}</td>
                <td>{member.researchArea}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Layout>

      <style jsx>{`
        .custom-table {
            class: "styled-table";
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 0.9em;
            font-family: sans-serif;
            min-width: 400px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        }
        .custom-table tbody tr {
            border-bottom: 1px solid #dddddd;
        }

        .custom-table tbody tr:nth-of-type(even) {
            background-color: #f3f3f3;
        }

        .custom-table tbody tr.active-row {
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
