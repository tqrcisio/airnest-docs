# airnest docs

Documentation for [airnest](https://github.com/tqrcisio/airnest), published at https://tqrcisio.github.io/airnest-docs.

Built with [Starlight](https://starlight.astro.build). The visual language follows the NestJS documentation
([nestjs/docs.nestjs.com](https://github.com/nestjs/docs.nestjs.com), MIT): colors, typography, the floating header and
menu, callouts and code theme live in `src/styles/nest.css` and `src/code-theme.mjs`. airnest is not affiliated with
NestJS.

## Writing

Pages are Markdown files in `src/content/docs/`. Add the page to the `sidebar` in `astro.config.mjs` to show it in the
menu.

```bash
pnpm install
pnpm dev
pnpm build
```

Every push to `main` deploys to GitHub Pages.
