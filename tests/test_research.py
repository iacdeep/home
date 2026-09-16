import datetime as dt
import importlib.util
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('research', ROOT / 'scripts/update_research.py')
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)
CONFIG = r.read_json(ROOT / 'data/research-config.json')
TODAY = dt.date(2026, 9, 16)


def record(**changes):
    item = dict(id='2601.12345', arxiv='2601.12345', title='Neural posterior estimation for galaxies',
                authors=['A. Researcher', 'M. Huertas-Company', 'B. Scientist'], abstract='We use simulation-based inference to estimate galaxy properties.',
                firstPosted='2026-01-20', updated='2026-01-20', doi='', journal='', url='https://arxiv.org/abs/2601.12345')
    return {**item, **changes}


class ResearchTests(unittest.TestCase):
    def test_authors_accents_initials_and_ads_order(self):
        names = ['Huertas-Company, M.', 'Andrés Asensio Ramos', 'Małgorzata Siudek']
        self.assertEqual([m['position'] for m in r.match_members(names, CONFIG)], [1, 2, 3])
        self.assertEqual(r.match_members(['Valentina Fontirroig Rojas'], CONFIG)[0]['id'], 'valentina-fontirroig-rojas')

    def test_fourth_author_and_namesakes_are_excluded(self):
        self.assertFalse(r.match_members(['A', 'B', 'C', 'M. Huertas-Company'], CONFIG))
        self.assertFalse(r.match_members(['Paul Hartmann', 'Juan Asensio', 'María Iglesias'], CONFIG))

    def test_collaboration_entry_counts(self):
        self.assertFalse(r.match_members(['Euclid Collaboration', 'A', 'B', 'M. Huertas-Company'], CONFIG))
        self.assertEqual(r.match_members(['Euclid Collaboration', 'M. Siudek', 'M. Huertas-Company'], CONFIG)[1]['position'], 3)

    def test_classification_requires_explicit_method(self):
        self.assertTrue(r.classify('Inferring galaxy properties', 'We use a Bayesian neural network.'))
        self.assertFalse(r.classify('A model of galaxy formation', 'We fit a model and infer the result.'))
        self.assertFalse(r.classify('Galaxy shapes', 'Previous studies use deep learning. We measure galaxy sizes.'))
        self.assertFalse(r.classify('Galaxy shapes', 'We do not use deep learning.'))

    def test_versions_merge_and_publisher_author_order_wins(self):
        arxiv = record(doi='10.1234/test')
        journal = record(id='2026Test', arxiv='', doi='10.1234/test', bibcode='2026Test', publicationYear=2026,
                         authors=['M. Huertas-Company', 'A', 'B'], journal='Journal 10 (2026)')
        merged = r.merge_records([arxiv, journal])
        self.assertEqual(len(merged), 1)
        self.assertEqual(merged[0]['id'], arxiv['id'])
        self.assertEqual(merged[0]['authors'][0], 'M. Huertas-Company')
        self.assertEqual(merged[0]['journal'], 'Journal 10 (2026)')

    def test_older_preprint_recent_journal_and_future_dates(self):
        old = record(id='2301.12345', firstPosted='2023-01-20', journal='Journal 5 (2024)')
        excluded = record(id='2301.23456', firstPosted='2023-01-20')
        future = record(id='2612.12345', firstPosted='2026-12-20')
        catalogue, _ = r.build_catalogue([old, excluded, future], CONFIG, {}, TODAY)
        self.assertEqual([p['id'] for p in catalogue['papers']], [old['id']])

    def test_manual_fulltext_decision_overrides_keywords(self):
        no_keywords = record(title='Stellar distances', abstract='We measure stellar distances.')
        override = {no_keywords['id']: {'include': True, 'tags': ['Simulation-based inference'], 'reason': 'Neural posterior estimator in full text'}}
        catalogue, _ = r.build_catalogue([no_keywords], CONFIG, override, TODAY)
        self.assertEqual(catalogue['papers'][0]['selection'], 'reviewed')
        with self.assertRaises(ValueError):
            r.build_catalogue([record()], CONFIG, {record()['id']: {'include': False}}, TODAY)

    def test_missing_index_record_retained_but_changed_author_order_removed(self):
        original, _ = r.build_catalogue([record()], CONFIG, {}, TODAY)
        other = record(id='2602.12345', arxiv='2602.12345', title='Bayesian spectral inversion')
        retained, _ = r.build_catalogue([other], CONFIG, {}, TODAY, original)
        self.assertEqual(len(retained['papers']), 2)
        changed = record(authors=['A', 'B', 'C', 'M. Huertas-Company'])
        removed, _ = r.build_catalogue([changed, other], CONFIG, {}, TODAY, original)
        self.assertEqual([p['id'] for p in removed['papers']], [other['id']])

    def test_api_errors_and_incomplete_pagination_fail_closed(self):
        with self.assertRaises(ValueError):
            r.parse_arxiv('<feed xmlns="http://www.w3.org/2005/Atom"/>')
        with patch.object(r, 'request', return_value=b'ignored'), patch.object(r, 'parse_arxiv', return_value=(10, [])):
            with self.assertRaises(ValueError):
                r.fetch_arxiv(CONFIG, TODAY)

    def test_failed_fetch_never_writes_catalogue(self):
        with patch('sys.argv', ['update_research.py']), patch.object(r, 'fetch_arxiv', side_effect=RuntimeError('offline')), patch.object(r, 'atomic_json') as write:
            with self.assertRaises(RuntimeError):
                r.main()
            write.assert_not_called()

    def test_fortnightly_schedule_crosses_month_and_year(self):
        anchor = dt.date(2026, 9, 16)
        for weeks in range(30):
            self.assertEqual(r.due_on(anchor + dt.timedelta(weeks=weeks), anchor), weeks % 2 == 0)
        self.assertFalse(r.due_on(anchor - dt.timedelta(days=14), anchor))


if __name__ == '__main__':
    unittest.main()
