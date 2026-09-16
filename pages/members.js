import Layout from '../components/layout';
import { useRouter } from 'next/router';
import utilStyles from '../styles/utils.module.css';
import styles from '../styles/Members.module.css';
import { membersData } from '../utils/constants';
import { seniorMembers } from '../utils/members';

export default function Members() {
  const { basePath } = useRouter();
  const seniorNames = new Set(seniorMembers.map(member => member.name));
  // Preserve the remaining roster until its next membership review.
  const otherMembers = membersData.filter((member, index, members) =>
    !seniorNames.has(member.name.replace('Asensio-Ramos', 'Asensio Ramos')) &&
    members.findIndex(candidate => candidate.name === member.name) === index
  );

  return (
    <section id="members" aria-labelledby="members-heading">
      <Layout home>
        <h2 id="members-heading" className={utilStyles.headingLg}>Team Members</h2>
        <h3 className={styles.sectionHeading}>Senior members</h3>
        <ul className={styles.grid}>
          {seniorMembers.map(member => (
            <li key={member.id} className={styles.card}>
              <div className={styles.photoFrame}>
              <img
                className={styles.portrait}
                src={`${basePath}${member.photo}`}
                alt={`Portrait of ${member.name}`}
                width="400"
                height="400"
                loading="lazy"
                decoding="async"
                style={member.photoCrop}
              />
              </div>
              <div className={styles.details}>
                <h4>{member.name}</h4>
                <p className={styles.role}>{member.role}</p>
                <a href={member.profileUrl} aria-label={`${member.profileLabel}: ${member.name}`}>
                  {member.profileLabel} <span aria-hidden="true">↗</span>
                </a>
                <p className={styles.credit}>
                  <a href={member.photoSourceUrl}>Photo: {member.photoCredit}</a>
                </p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className={styles.sectionHeading}>Other team members</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <caption className={styles.srOnly}>Other team members, roles and research areas</caption>
            <thead>
              <tr><th scope="col">Name</th><th scope="col">Role</th><th scope="col">Research area</th></tr>
            </thead>
            <tbody>
              {otherMembers.map(member => (
                <tr key={member.name}>
                  <th scope="row">{member.name}</th>
                  <td>{member.role}</td>
                  <td>{member.researchArea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </section>
  );
}
