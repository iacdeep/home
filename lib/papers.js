import catalogue from '../data/research.json';

// Serve a validated snapshot; page rendering never depends on an external API.
export async function getPapers() {
  return catalogue;
}
