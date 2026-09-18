# Artificial Intelligence and Advance Inference (IA2)

Website for the IA2 group at the Instituto de Astrofísica de Canarias.

- Website: https://iacdeep.github.io/home/
- IAC project: https://www.iac.es/es/proyectos/inteligencia-artificial-e-inferencia-avanzada-ia2-0

## Updating the team

Edit `utils/members.js` to update team members, their order, roles, portraits and profile links. Portraits are stored in `public/images/members/` so the site does not depend on remote image servers. Record image sources and credits in `public/images/members/SOURCES.md` when replacing a photo.

The visible roster is maintained only in `utils/members.js`, with a role of `Faculty`, `Postdoc` (optionally qualified, e.g. `Postdoc (RyC)`) or `Grad Student` for each person. Members without a portrait use an `initials` placeholder until a photo is available. `utils/constants.js` continues to supply the existing publication search independently.

## Development

```sh
npm ci
npm run dev
npm run build
```

The local site uses the `/iacdeep` base path from `next.config.js`. GitHub Pages supplies its deployment base path during the existing Actions build. The static output is written to `out/`.

The featured-research feed requires an ADS API token in the `API_KEY` environment variable. Without it, the site still builds but displays the existing research-feed error state. GitHub Actions uses the repository's `API_KEY` secret.

Pushes to `main` publish through the existing GitHub Pages workflow. Membership and photo updates are editorial changes; they are not automatically scraped from the IAC directory.
