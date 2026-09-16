import { useState } from 'react';
import Link from 'next/link';
import { teamMembers } from '../utils/members';
import styles from './research.module.css';

export default function ResearchList({ catalogue, featured = false }) {
  const [query, setQuery] = useState('');
  const [member, setMember] = useState('');
  const papers = catalogue.papers.filter(paper => {
    const searchable = [paper.title, paper.summary, ...paper.tags, ...paper.firstAuthors].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const needle = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return searchable.includes(needle) && (!member || paper.matches.some(match => match.id === member));
  });
  const visible = featured ? papers.slice(0, 6) : papers;
  return (
    <section className={styles.section} aria-labelledby={featured ? 'featured-title' : 'research-title'}>
      <p className={styles.eyebrow}>IA2 · RESEARCH</p>
      <h2 id={featured ? 'featured-title' : 'research-title'}>{featured ? 'Featured Research' : 'Research catalogue'}</h2>
      <p className={styles.intro}>AI and advanced inference across astrophysics. Papers from 2024 onward, including preprints, with an IA2 member among the first three listed authors.</p>
      <p className={styles.updated}>{catalogue.papers.length} papers · Checked {catalogue.lastChecked} · Updated every two weeks</p>
      {!featured && <div className={styles.filters}>
        <label>Search research<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Title, author or method" /></label>
        <label>Group member<select value={member} onChange={event => setMember(event.target.value)}>
          <option value="">All members</option>
          {teamMembers.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}
        </select></label>
      </div>}
      {!featured && <p role="status" className={styles.updated}>{papers.length} matching papers</p>}
      <ol className={styles.list}>
        {visible.map(paper => <li className={styles.paper} key={paper.id}>
          <p className={styles.meta}>{paper.year} · {paper.journal || 'arXiv record'}</p>
          <h3><a href={paper.url} target="_blank" rel="noopener noreferrer">{paper.title}</a></h3>
          <p className={styles.authors}>{paper.firstAuthors.map((author, index) => <span key={`${author}-${index}`}>
            {index > 0 && ', '}{paper.matches.some(match => match.position === index + 1) ? <strong>{author}</strong> : author}
          </span>)}{paper.authorCount > 3 && ' et al.'}</p>
          {paper.summary && <p className={styles.summary}>{paper.summary}</p>}
          <div className={styles.tags}>{paper.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          <div className={styles.links}><a href={paper.url} target="_blank" rel="noopener noreferrer">Read paper ↗</a>{paper.doi && <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">Journal ↗</a>}</div>
        </li>)}
      </ol>
      {!visible.length && <p>No papers match this selection.</p>}
      {featured ? <Link className={styles.browse} href="/papers">Browse all {catalogue.papers.length} papers →</Link> :
        <details className={styles.details}><summary>How papers are selected</summary><p>At least one current group member must appear in positions 1–3 of the source author list. Collaboration names count as listed entries. We include explicit applications of machine learning, Bayesian or simulation-based inference, and advanced inverse methods; ordinary regression or a future inference application alone does not qualify.</p><p>Dates refer to the journal year where available, otherwise the first preprint year. Earlier preprints published since 2024 are included when publication metadata is verified. Preprint and journal versions are combined. The initial collection was checked against abstracts and, where needed, full texts; new entries are selected automatically from explicit method evidence in titles and abstracts.</p><p>Coverage depends on source indexing and author-name variants. Methods described only in full text may need a manual addition. <a href="https://github.com/iacdeep/home/blob/main/docs/research-maintenance.md" target="_blank" rel="noopener noreferrer">Search record and maintenance details ↗</a></p></details>}
    </section>
  );
}
