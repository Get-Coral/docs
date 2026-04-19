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
      description: 'Documentation for the Coral ecosystem of Jellyfin modules',
      customCss: ['./src/styles.css'],
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
              label: 'KAPOW',
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
