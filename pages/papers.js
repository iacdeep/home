import Layout from '../components/layout';
import ResearchList from '../components/ResearchList';
import { getPapers } from '../lib/papers';

export async function getStaticProps() {
  return { props: { allPapers: await getPapers() } };
}

export default function Papers({ allPapers, featured = false }) {
  return <div id="papers"><Layout home={featured}><ResearchList catalogue={allPapers} featured={featured} /></Layout></div>;
}
