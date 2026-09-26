// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.getcoral.dev',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    starlight({
      title: 'Coral Docs',
      description:
        "Install, configure and operate Coral's open-source Jellyfin modules. Each one runs as a Docker container and does one thing well.",
      customCss: ['./src/styles.css'],
      // Adds the JSON-LD graph, the social card and non-blocking fonts that
      // Starlight does not ship. See src/components/Head.astro.
      components: {
        Head: './src/components/Head.astro',
      },
      // Freshness signal. The docs drifted a long way from the code once
      // already; showing the date makes the next drift visible.
      lastUpdated: true,
      editLink: {
        baseUrl: 'https://github.com/Get-Coral/docs/edit/main/',
      },
      expressiveCode: {
        themes: ['github-dark'],
        useStarlightDarkModeSwitch: false,
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Get-Coral',
        },
        {
          icon: 'discord',
          label: 'Discord',
          href: 'https://discord.gg/M3wzFpGbzp',
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started/introduction' },
            {
              label: 'create-coral CLI',
              slug: 'getting-started/create-coral',
            },
            {
              label: 'Docker Compose',
              slug: 'getting-started/docker-compose',
            },
            {
              label: 'Module contracts',
              slug: 'getting-started/module-contracts',
            },
          ],
        },
        {
          label: 'Modules',
          items: [
            {
              label: 'Aurora',
              slug: 'modules/aurora',
            },
            {
              label: 'Fathom',
              slug: 'modules/fathom',
            },
            {
              label: 'Librarian',
              slug: 'modules/librarian',
            },
            {
              label: 'KAPOW!',
              slug: 'modules/kapow',
            },
            {
              label: 'Encore',
              slug: 'modules/encore',
            },
            {
              label: 'Marquee',
              slug: 'modules/marquee',
            },
            {
              label: 'Tide',
              slug: 'modules/tide',
            },
          ],
        },
        {
          label: 'Libraries',
          items: [
            {
              label: 'Coral UI',
              slug: 'libraries/coral-ui',
            },
            {
              label: 'Jellyfin API Client',
              slug: 'libraries/jellyfin',
            },
            {
              label: 'NPM Packages',
              slug: 'libraries/npm-packages',
            },
          ],
        },
        {
          label: 'Contributing',
          items: [
            { label: 'Get Started', slug: 'contributing/getting-started' },
            {
              label: 'Project Templates',
              slug: 'contributing/project-templates',
            },
          ],
        },
      ],
    }),
  ],
});
