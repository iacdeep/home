import Layout from '../components/layout';
import { useRouter } from 'next/router';
import utilStyles from '../styles/utils.module.css';
import styles from '../styles/Members.module.css';
import { teamMembers } from '../utils/members';

export default function Members() {
  const { basePath } = useRouter();
  return (
    <section id="members" aria-labelledby="members-heading">
      <Layout home>
        <h2 id="members-heading" className={utilStyles.headingLg}>Team Members</h2>
        <ul className={styles.grid}>
          {teamMembers.map(member => (
            <li key={member.id} className={styles.card}>
              <div className={styles.photoFrame}>
                {member.photo ? <img
                  className={styles.portrait}
                  src={`${basePath}${member.photo}`}
                  alt={`Portrait of ${member.name}`}
                  width="400"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  style={member.photoCrop}
                /> : (
                  <div className={styles.initials} aria-hidden="true">
                    {member.initials}
                  </div>
                )}
              </div>
              <div className={styles.details}>
                <h3>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
                {member.profileUrl && (
                  <a href={member.profileUrl} aria-label={`${member.profileLabel}: ${member.name}`}>
                    {member.profileLabel} <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

      </Layout>
    </section>
  );
}
