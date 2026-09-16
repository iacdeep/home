# Artificial Intelligence and Advance Inference (IA2)

Website for the IA2 group at the Instituto de Astrofísica de Canarias.

- Website: https://iacdeep.github.io/home/
- IAC project: https://www.iac.es/es/proyectos/inteligencia-artificial-e-inferencia-avanzada-ia2-0

## Updating the team

Edit `utils/members.js` to update senior members, their order, roles, portraits and profile links. Portraits are stored in `public/images/members/` so the site does not depend on remote image servers. Record image sources and credits in `public/images/members/SOURCES.md` when replacing a photo.

The remaining roster is kept in `utils/constants.js` pending a separate membership review. That file also supplies the existing publication search; the senior-member refresh does not alter that search.

## Development

```sh
npm ci
npm run dev
npm run build
```

The local site uses the `/iacdeep` base path from `next.config.js`. GitHub Pages supplies its deployment base path during the existing Actions build. The static output is written to `out/`.

The featured-research feed requires an ADS API token in the `API_KEY` environment variable. Without it, the site still builds but displays the existing research-feed error state. GitHub Actions uses the repository's `API_KEY` secret.

Pushes to `main` publish through the existing GitHub Pages workflow. Membership and photo updates are editorial changes; they are not automatically scraped from the IAC directory.
