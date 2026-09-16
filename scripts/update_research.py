#!/usr/bin/env python3
"""Refresh the static research catalogue. No third-party Python dependencies."""
import argparse
import datetime as dt
import json
import os
from pathlib import Path
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
NS = {'a': 'http://www.w3.org/2005/Atom', 'x': 'http://arxiv.org/schemas/atom',
      'o': 'http://a9.com/-/spec/opensearch/1.1/'}

# Deliberately exclude the unqualified words "AI", "inference", "model" and "fit".
METHODS = {
    'Machine learning': r'machine[ -]learning|deep[ -]learning|artificial intelligence|random forests?|Fisher[ -]EM|support vector|gradient boost',
    'Neural networks': r'neural (?:networks?|fields?|emulators?|posterior)|auto[ -]?encod|convolutional neural|graph neural|physics[ -]informed',
    'Foundation models': r'foundation models?|large language models?|self[ -]supervised|contrastive learning|AstroPT|Zoobot',
    'Generative models': r'diffusion (?:models?|posterior)|normalizing flows?|flow matching|generative (?:models?|modeling|modelling)',
    'Simulation-based inference': r'simulation[ -]based inference|amorti[sz]ed inference|implicit likelihood|neural posterior estimat',
    'Bayesian inference': r'Bayesian|posterior (?:sampling|distribution|estimat)|nested sampl|Markov[ -]chain Monte Carlo|Hamiltonian Monte Carlo|maximum a[ -]posteriori|marginali[sz]',
    'Spectral inference': r'spectro[ -]?polarimetric inversion|(?:NLTE|non[ -]LTE|Stokes|spectral) inversions?|(?:HAZEL|STiC|SIR) inversion|CIGALE|Prospector|pPXF',
    'Field-level inference': r'field[ -]level (?:cosmological )?inference|Bayesian reconstruction|bias assignment method',
}


def read_json(path):
    return json.loads(Path(path).read_text())


def normalized(value):
    value = value.translate(str.maketrans({'ł': 'l', 'Ł': 'L'}))
    return re.sub('[^a-z0-9]', '', unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode().lower())


def author_key(name):
    # ADS: "Surname, First"; arXiv: "First Surname".
    if ',' in name:
        family, given = name.split(',', 1)
        name = given + ' ' + family
    return normalized(name)


def match_members(authors, config):
    matches = []
    for position, author in enumerate(authors[:3], 1):
        for member in config['members']:
            if author_key(author) in {author_key(a) for a in member['aliases']}:
                matches.append({'id': member['id'], 'position': position})
    return matches


def classify(title, abstract):
    """Conservative automatic shortlist; curated decisions take precedence."""
    # Skip background-only sentences describing previous work or absent methods.
    sentences = re.split(r'(?<=[.!?])\s+', abstract)
    contexts = [title] + [s for s in sentences if
        re.search(r'\b(we|our|using|employ|appl|implement|train|develop|present|introduc|based on|method)', s, re.I)
        and not re.search(r'\b(previous (?:studies|work)|future work|do not use|without using|rather than|unlike previous)', s, re.I)]
    text = '\n'.join(contexts)
    return [label for label, pattern in METHODS.items() if re.search(pattern, text, re.I)]


def parse_arxiv(xml):
    root = ET.fromstring(xml)
    total = int(root.findtext('o:totalResults', '-1', NS))
    if total < 0:
        raise ValueError('arXiv response has no totalResults; refusing incomplete results')
    records = []
    for entry in root.findall('a:entry', NS):
        def field(name):
            return ' '.join(entry.findtext(name, '', NS).split())
        identifier = re.sub(r'v\d+$', '', field('a:id').split('/abs/')[-1])
        if not re.fullmatch(r'\d{4}\.\d{4,5}', identifier):
            raise ValueError('Unexpected arXiv entry or API error')
        records.append({'id': identifier, 'arxiv': identifier,
            'title': field('a:title'), 'abstract': field('a:summary'),
            'authors': [a.findtext('a:name', '', NS).strip() for a in entry.findall('a:author', NS)],
            'firstPosted': field('a:published')[:10], 'updated': field('a:updated')[:10],
            'doi': field('x:doi'), 'journal': field('x:journal_ref'),
            'url': 'https://arxiv.org/abs/' + identifier})
    return total, records


def request(url, headers=None):
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'IA2-research-catalogue/1.0 (https://iacdeep.github.io/home/)', **(headers or {})})
            with urllib.request.urlopen(req, timeout=90) as response:
                return response.read()
        except Exception:
            if attempt == 2:
                raise
            time.sleep(5 * (attempt + 1))


def fetch_arxiv(config, today):
    records = []
    lower = config['preprintLookback'].replace('-', '') + '0000'
    upper = today.isoformat().replace('-', '') + '2359'
    for author_query in config['arxivQueries']:
        start = 0
        while True:
            query = f'({author_query}) AND submittedDate:[{lower} TO {upper}]'
            url = 'https://export.arxiv.org/api/query?' + urllib.parse.urlencode({
                'search_query': query, 'start': start, 'max_results': 500,
                'sortBy': 'submittedDate', 'sortOrder': 'descending'})
            print(f'Querying arXiv, offset {start}', flush=True)
            total, batch = parse_arxiv(request(url))
            print(f'Received {len(batch)} of {total} records', flush=True)
            if not batch and start < total:
                raise ValueError('arXiv pagination ended early')
            records.extend(batch)
            start += len(batch)
            time.sleep(3)  # arXiv API courtesy interval, also across queries
            if start >= total:
                break
    if not records:
        raise ValueError('Empty arXiv search; retaining previous catalogue')
    return records


def fetch_ads(config, today, token):
    records = []
    start = 0
    query = '(' + ' OR '.join(f'author:"{a}"' for a in config['adsAuthors']) + ')'
    query += f' AND pubdate:[{config["since"]} TO {today.isoformat()}]'
    while True:
        url = 'https://api.adsabs.harvard.edu/v1/search/query?' + urllib.parse.urlencode({
            'q': query, 'fl': 'title,bibcode,author,abstract,pubdate,doi,identifier,pub,doctype',
            'rows': 200, 'start': start, 'sort': 'date desc'})
        response = json.loads(request(url, {'Authorization': 'Bearer ' + token}))['response']
        docs = response['docs']
        if not docs and start < response['numFound']:
            raise ValueError('ADS pagination ended early')
        for doc in docs:
            if doc.get('doctype') not in ['article', 'eprint', 'inproceedings']:
                continue
            ids = doc.get('identifier', [])
            arxiv = next((re.sub(r'v\d+$', '', i.removeprefix('arXiv:')) for i in ids
                          if re.fullmatch(r'(arXiv:)?\d{4}\.\d{4,5}(v\d+)?', i)), '')
            date = doc.get('pubdate', '')[:10]
            records.append({'id': arxiv or doc['bibcode'], 'arxiv': arxiv,
                'title': doc['title'][0], 'abstract': doc.get('abstract', ''),
                'authors': doc.get('author', []), 'firstPosted': '',
                'publicationYear': int(date[:4]), 'updated': date,
                'doi': next(iter(doc.get('doi', [])), ''), 'journal': doc.get('pub', ''),
                'url': 'https://ui.adsabs.harvard.edu/abs/' + doc['bibcode'],
                'bibcode': doc['bibcode']})
        start += len(docs)
        if start >= response['numFound']:
            return records


def merge_records(records):
    """arXiv ID, then DOI, then exact normalized title prevent duplicate versions."""
    result, keys = [], {}
    for record in records:
        identifiers = ['title:' + normalized(record['title'])]
        if record.get('arxiv'):
            identifiers.append('arxiv:' + record['arxiv'])
        if record.get('doi'):
            identifiers.append('doi:' + record['doi'].lower())
        index = next((keys[k] for k in identifiers if k in keys), None)
        if index is None:
            index = len(result)
            result.append(dict(record))
        else:
            current = result[index]
            # ADS has journal metadata; retain arXiv title, first submission and ID.
            for key in ['doi', 'journal', 'publicationYear', 'bibcode']:
                if record.get(key):
                    current[key] = record[key]
            if not current.get('abstract') and record.get('abstract'):
                current['abstract'] = record['abstract']
            if record.get('bibcode'):
                current['authors'] = record['authors']  # publisher/ADS author order
            if record.get('arxiv') and not current.get('arxiv'):
                current.update({k: record[k] for k in ['id', 'arxiv', 'url', 'firstPosted']})
        for key in identifiers:
            keys[key] = index
    return result


def clean_title(title):
    for latex, plain in [(r'\times', '×'), (r'\sim', '≈'), (r'\alpha', 'α'), (r'\beta', 'β'), (r'\leq', '≤'), (r'\le', '≤'), (r'\Lambda', 'Λ')]:
        title = title.replace(latex, plain)
    return title.replace('$', '').replace('{', '').replace('}', '')


def paper_year(record):
    years = re.findall(r'\b(20\d\d)\b', record.get('journal', ''))
    return max([int(record.get('firstPosted', '')[:4] or 0), record.get('publicationYear', 0)] + [int(y) for y in years])


def build_catalogue(records, config, overrides, today, previous=None):
    selected, screened = {}, []
    seen = set()
    for record in merge_records(records):
        seen.add(record['id'])
        override = overrides.get(record['id'], {})
        record.update({k: v for k, v in override.items() if k in ['title', 'journal', 'doi', 'publicationYear']})
        record['title'] = clean_title(record['title'])
        matches = match_members(record['authors'], config)
        if not matches:
            continue
        year = paper_year(record)
        if year < int(config['since'][:4]) or year > today.year or record.get('firstPosted', '') > today.isoformat():
            continue
        tags = override.get('tags', classify(record['title'], record.get('abstract', '')))
        include = override.get('include', bool(tags))
        reason = override.get('reason', 'Explicit method terms in title/abstract' if include else 'No explicit qualifying method found in title/abstract')
        screened.append({'id': record['id'], 'title': record['title'], 'url': record['url'], 'included': include, 'reason': reason, 'matches': matches, 'firstAuthors': record['authors'][:3], 'sources': override.get('sources', [record['url']])})
        if not include:
            continue
        selected[record['id']] = {k: record[k] for k in ['id', 'title', 'url', 'doi', 'journal', 'firstPosted']}
        selected[record['id']].update({'year': year, 'firstAuthors': record['authors'][:3],
            'authorCount': len(record['authors']), 'matches': matches, 'tags': tags,
            'summary': override.get('summary', ''), 'selection': 'reviewed' if override else 'automatic',
            'sources': override.get('sources', [record['url']])})
    # Never erase earlier verified results due to incomplete or changing indexing.
    for old in (previous or {}).get('papers', []):
        if old['id'] not in seen and old['id'] not in selected and overrides.get(old['id'], {}).get('include') is not False:
            if match_members(old['firstAuthors'], config) and not any(
                (old.get('doi') and old['doi'].lower() == new.get('doi', '').lower())
                or normalized(old['title']) == normalized(new['title'])
                for new in selected.values()
            ):
                selected[old['id']] = old
    papers = sorted(selected.values(), key=lambda p: (p['year'], p['firstPosted'], p['id']), reverse=True)
    if not papers:
        raise ValueError('Selection unexpectedly empty; retaining previous catalogue')
    return {'since': config['since'], 'lastChecked': today.isoformat(), 'papers': papers}, screened


def due_on(date, anchor):
    days = (date - anchor).days
    return days >= 0 and days % 14 == 0


def atomic_json(path, value):
    temp = path.with_suffix('.tmp')
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    temp.replace(path)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--arxiv-files', nargs='+', help='Use downloaded complete API pages for reproducible initial curation')
    parser.add_argument('--check-due', action='store_true')
    parser.add_argument('--validate', action='store_true')
    args = parser.parse_args()
    config = read_json(ROOT / 'data/research-config.json')
    today = dt.datetime.now(dt.timezone.utc).date()
    if args.check_due:
        print(str(due_on(today, dt.date.fromisoformat(config['scheduleAnchor']))).lower())
        return
    team = json.loads(re.search(r'export const teamMembers = (\[.*\]);', (ROOT / 'utils/members.js').read_text(), re.S).group(1))
    if {m['id'] for m in team} != {m['id'] for m in config['members']}:
        raise ValueError('Research author configuration must match the visible team roster')
    path = ROOT / 'data/research.json'
    previous = read_json(path) if path.exists() else None
    if args.validate:
        assert previous and previous['papers'], 'Missing catalogue'
        ids = [p['id'] for p in previous['papers']]
        assert len(ids) == len(set(ids)), 'Duplicate paper IDs'
        for paper in previous['papers']:
            assert match_members(paper['firstAuthors'], config) == paper['matches'], paper['id']
            assert paper['tags'] and paper['year'] >= int(config['since'][:4]), paper['id']
            assert paper['url'].startswith('https://'), paper['id']
        print(f'Validated {len(ids)} papers against the current team and author-order rule')
        return
    if args.arxiv_files:
        records = [r for filename in args.arxiv_files for r in parse_arxiv(Path(filename).read_bytes())[1]]
        source_status = {'arxiv': 'complete downloaded search pages', 'ads': 'not queried locally'}
    else:
        records = fetch_arxiv(config, today)
        source_status = {'arxiv': 'complete', 'ads': 'not configured'}
        token = os.environ.get('API_KEY') or os.environ.get('ADS_API_TOKEN')
        if token:
            try:
                records.extend(fetch_ads(config, today, token))
                source_status['ads'] = 'complete'
            except Exception as error:
                # Do not expose request headers, tokens, or response bodies.
                source_status['ads'] = 'unavailable; previous records retained'
                print(f'::warning::ADS unavailable ({type(error).__name__}); using complete arXiv search and saved records')
    overrides = read_json(ROOT / 'data/research-overrides.json')
    catalogue, screened = build_catalogue(records, config, overrides, today, previous)
    catalogue['sources'] = source_status
    report = {'checked': today.isoformat(), 'sources': source_status,
        'uniqueRecords': len(merge_records(records)), 'eligibleAuthorRecords': len(screened),
        'selectedPapers': len(catalogue['papers']), 'screened': screened}
    # All remote queries, parsing and selection finish before existing data is touched.
    atomic_json(ROOT / 'data/research-audit.json', report)
    atomic_json(path, catalogue)
    print(f'Checked {report["uniqueRecords"]} records; {len(screened)} pass date/author filters; {len(catalogue["papers"])} selected')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(f'Research update failed ({type(error).__name__}): {error}', file=sys.stderr)
        sys.exit(1)
