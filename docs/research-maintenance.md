# IA2 research catalogue

The public catalogue is generated from `data/research.json`. The homepage shows the six latest entries; `/papers` contains the complete searchable collection. Normal site builds use this saved snapshot and do not require a working literature API.

## Initial search: 16 September 2026

Scope: papers first posted or published from 1 January 2024 through 16 September 2026, including preprints. The arXiv search looked back to January 2022 to find earlier preprints with recent journal publication dates. Broad surname searches and complementary compound-name/initial queries were paginated to completion. The union contained **1,738 unique records**. Exact normalized name variants and the first-three-author rule yielded **66 date-eligible candidates**, of which **49** were selected after method screening: 19 dated 2024, 18 dated 2025 and 12 dated 2026.

The primary search used the arXiv API and its complete ordered author lists, abstracts, DOIs and journal references. Targeted searches of IAC publication pages, publisher records and authors' publication lists supplemented missing journal metadata. Full texts were checked where abstracts did not establish the method. Examples include neural posterior estimation in [Semiresolved Stellar Populations](https://arxiv.org/html/2609.01400), nested sampling in [quiescent-galaxy outflows](https://arxiv.org/html/2607.06844), CIGALE fits in [MaNGA dwarf AGN](https://arxiv.org/html/2503.03742), and spectral reconstruction in [ZF-UDS-7329](https://arxiv.org/html/2501.06050).

The checked publication dates include four 2023 preprints published in 2024: [JWST morphology](https://doi.org/10.1051/0004-6361/202346800), [contrastive disk analysis](https://doi.org/10.3847/1538-4357/ad05bb), [three-dimensional galaxy shapes](https://doi.org/10.3847/1538-4357/ad1a13), and [Bayesian modified-gravity learning](https://doi.org/10.1051/0004-6361/202347929).

This is a systematic search, not a guarantee of universal bibliographic completeness. ADS was not available for the initial local search. Journal-only articles, unlisted name variants, older preprints with missing publication metadata, and methods only described in full text can be missed. No eligible paper was found for Marina Dunn in this search; this does not imply that she has no publications. Counts below overlap when a paper has multiple IA2 members in its first three positions.

| Member | Matching papers |
| --- | ---: |
| Marc Huertas-Company | 18 |
| Andrés Asensio Ramos | 13 |
| Gosia Siudek | 9 |
| Francisco Kitaura | 5 |
| Patricia Iglesias-Navarro | 4 |
| Jorge Camalich | 2 |
| Carlos Westendorp | 2 |
| Eduardo Hartmann | 1 |
| Valentina Fontirroig Rojas | 1 |
| Jorge M. Sarrato Alós | 1 |
| Marina Dunn | 0 |

## Selection rules

- A current roster member must occur in positions 1, 2 or 3 of the ordered source author list. A collaboration label occupies a position; we do not silently remove it. ADS author lists take precedence when journal metadata is available.
- Accept explicit applications of machine learning, neural networks, foundation/generative models, Bayesian inference, simulation-based inference, and advanced inverse methods, including spectral inversions. Routine regression, standard line measurements, forward physical simulations and discussion of a future inference application alone are insufficient.
- Name matching normalizes accents, punctuation, Polish ł and ADS surname-first format, but uses explicit aliases to avoid unrelated authors. Add new member aliases in `data/research-config.json`; validation checks that its IDs match the visible team.
- Dates use the latest verified journal year or first preprint year. Revisions alone do not make an old paper recent. Journal/preprint versions merge by arXiv ID, DOI or normalized title.
- Every initial decision, including exclusions, is recorded in `data/research-overrides.json`. Sources and original short summaries are included. `data/research-audit.json` records each eligible candidate and its selection reason. Audit counts update on later runs; the counts above describe the initial search.

## Automatic publication every two weeks

`.github/workflows/nextjs.yml` runs on Wednesdays at approximately **08:17 UTC**. A date guard allows research updates every 14 days from **16 September 2026**, making the next scheduled update **30 September 2026**, then 14 October, 28 October, and so on. GitHub may delay scheduled starts. This runs on GitHub and does not need a local computer or Codex session to remain open.

On a due run, the workflow:

1. Runs selection tests, then fetches all pages of the configured arXiv queries.
2. Also queries ADS if the repository's existing `API_KEY` secret is a valid ADS token. No new secret is needed for arXiv. ADS failures produce a warning and preserve saved ADS-only entries.
3. Applies author/date rules and the method classifier, preserving reviewed overrides. New automatic selections require explicit method evidence in the title or methodological abstract sentences. They do not receive invented prose summaries.
4. Validates the catalogue and builds the static site.
5. Commits the validated catalogue and audit with `GITHUB_TOKEN`, then deploys the same build to Pages. A failed fetch, validation, build or push stops publication, leaving the deployed site intact.

GitHub's token commits do not trigger another push workflow; publication happens in the same scheduled run. The old weekly Pages rebuild has been replaced. Repository Actions must remain enabled, and branch protection must allow the bot's snapshot commits. Failures are visible in the repository Actions tab. Use **Run workflow** to refresh and publish on demand; ordinary code pushes publish the checked-in snapshot.

The classifier is deliberately conservative and is not a substitute for full-text scientific review. It can miss papers whose method is absent from their abstract, and automatic selection can occasionally require correction. To add or exclude a paper already found by the searches, edit its override, including a source and reason, then run the updater. Previously indexed papers are retained when missing from later searches, but are removed when a refreshed author list no longer qualifies or an explicit exclusion is added.

## Local commands

```sh
python3 -m unittest discover -s tests -v
python3 scripts/update_research.py
python3 scripts/update_research.py --validate
npm run build
```

The updater uses Python's standard library. Optionally set `ADS_API_TOKEN` or `API_KEY` in the environment; never commit credentials. `--arxiv-files file1.xml file2.xml ...` reproduces a curation from downloaded search pages. `--check-due` prints the UTC schedule decision without querying sources.
