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
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started/introduction' },
            {
              label: 'create-coral CLI',
              slug: 'getting-started/create-coral',
              badge: { text: '0.1.0', variant: 'success' },
            },
          ],
        },
        {
          label: 'Modules',
          items: [
            {
              label: 'Aurora',
              slug: 'modules/aurora',
              badge: { text: '1.4.0', variant: 'tip' },
            },
            {
              label: 'Fathom',
              slug: 'modules/fathom',
              badge: { text: '0.1.0', variant: 'note' },
            },
            {
              label: 'Librarian',
              slug: 'modules/librarian',
              badge: { text: '0.1.0', variant: 'note' },
            },
            {
              label: 'KAPOW',
              slug: 'modules/kapow',
              badge: { text: '1.0.0', variant: 'tip' },
            },
            {
              label: 'Encore',
              slug: 'modules/encore',
              badge: { text: '0.1.0', variant: 'note' },
            },
            {
              label: 'Marquee',
              slug: 'modules/marquee',
              badge: { text: '0.1.0', variant: 'note' },
            },
          ],
        },
        {
          label: 'Libraries',
          items: [
            {
              label: 'Jellyfin API Client',
              slug: 'libraries/jellyfin',
              badge: { text: '1.2.0', variant: 'success' },
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
