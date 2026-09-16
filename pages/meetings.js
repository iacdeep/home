import Layout from '../components/layout';
import schedule from '../data/meetings.json';
import styles from '../styles/meetings.module.css';

export default function Meetings({ embedded = false }) {
  return (
    <div id="meetings" className={styles.anchor}>
      <Layout home={embedded}>
        <section className={styles.section} aria-labelledby="meetings-title">
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>IA2 · GROUP MEETINGS</p>
              <h2 id="meetings-title">Meetings</h2>
            </div>
            <span className={styles.year}>Academic year {schedule.academicYear}</span>
          </header>
          <ol className={styles.schedule}>
            {schedule.meetings.map(meeting => {
              const date = new Date(`${meeting.date}T12:00:00Z`);
              const formatDate = options => new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' }).format(date);
              return (
                <li className={styles.meeting} key={meeting.id}>
                  <time className={styles.date} dateTime={meeting.date} aria-label={formatDate({ dateStyle: 'full' })}>
                    <span className={styles.month}>{formatDate({ month: 'short' })}</span>
                    <span className={styles.day}>{formatDate({ day: 'numeric' })}</span>
                    <span className={styles.weekday}>{formatDate({ weekday: 'long' })}</span>
                  </time>
                  <div className={styles.details}>
                    <p className={styles.fullDate}>{formatDate({ day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <h3>{meeting.title}</h3>
                    <p className={styles.logistics}>
                      {meeting.time || 'Time to be announced'}
                      <span aria-hidden="true"> · </span>
                      {meeting.location || 'Location to be announced'}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className={styles.note}>More meetings will be added throughout the academic year.</p>
        </section>
      </Layout>
    </div>
  );
}
