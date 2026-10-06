// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { nestCodeTheme } from './src/code-theme.mjs';

export default defineConfig({
  site: 'https://tqrcisio.github.io',
  base: '/airnest-docs',
  integrations: [
    starlight({
      title: 'airnest',
      description: 'Airflow-style DAG orchestration for NestJS and PostgreSQL',
      logo: { src: './src/assets/logo.svg' },
      favicon: '/favicon.svg',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/tqrcisio/airnest' }],
      editLink: { baseUrl: 'https://github.com/tqrcisio/airnest-docs/edit/main/' },
      customCss: ['./src/styles/nest.css'],
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;600&family=Manrope:wght@400;500;600;700;800&display=swap',
          },
        },
      ],
      expressiveCode: {
        themes: [nestCodeTheme],
        useStarlightUiThemeColors: false,
        styleOverrides: {
          borderRadius: '12px',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          codeFontFamily: "Inconsolata, Consolas, 'Courier New', monospace",
          codeFontSize: '15px',
          codeLineHeight: '24px',
          codePaddingInline: '1.6rem',
          codePaddingBlock: '1.1rem',
          uiFontFamily: "Manrope, 'Helvetica Neue', sans-serif",
          frames: {
            editorTabBarBackground: '#1c1819',
            editorActiveTabBackground: '#1c1819',
            editorActiveTabIndicatorTopColor: 'transparent',
            editorActiveTabIndicatorBottomColor: 'transparent',
            editorTabBarBorderBottomColor: 'rgba(255, 255, 255, 0.08)',
            terminalTitlebarBackground: '#1c1819',
            terminalBackground: '#151112',
            frameBoxShadowCssValue: 'none',
          },
        },
      },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Introduction', slug: 'start/introduction' },
            { label: 'Getting started', slug: 'start/getting-started' },
          ],
        },
        {
          label: 'Concepts',
          items: [
            { label: 'DAGs and tasks', slug: 'concepts/dags-and-tasks' },
            { label: 'Runs and logical dates', slug: 'concepts/runs' },
            { label: 'Trigger rules', slug: 'concepts/trigger-rules' },
            { label: 'Retries, timeouts and leases', slug: 'concepts/retries-and-leases' },
            { label: 'Versions', slug: 'concepts/versions' },
            { label: 'Architecture', slug: 'concepts/architecture' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Triggering runs', slug: 'guides/triggering-runs' },
            { label: 'Scheduler and workers', slug: 'guides/scheduler-and-workers' },
            { label: 'Testing DAGs', slug: 'guides/testing' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Decorators', slug: 'reference/decorators' },
            { label: 'Module options', slug: 'reference/module-options' },
            { label: 'Airnest service', slug: 'reference/airnest-service' },
            { label: 'Database schema', slug: 'reference/database-schema' },
          ],
        },
        { label: 'Roadmap', slug: 'roadmap' },
      ],
    }),
  ],
});
