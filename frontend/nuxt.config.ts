// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/main.css'],

  app: {
    head: {
      title: 'Desainmu.ID',
      script: [
        {
          src: 'https://app.sandbox.midtrans.com/snap/snap.js',
          'data-client-key': 'Mid-client-9uSzCZTqCCL5tOgj',
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/logo/logo1.png',
        }
      ]
    }
  },

  pages: true,

  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  // devServer: {
  //   host: '0.0.0.0'
  // }
})