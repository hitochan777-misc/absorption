// https://github.com/buefy/nuxt-buefy/issues/32
global.File= typeof window === 'undefined' ? Object : window.File

export default {
  /*
  ** Headers of the page
  */
  head: {
    title: 'absorption',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  modules: [
    'nuxt-buefy',
    '@nuxtjs/apollo',
    ['nuxt-sass-resources-loader', '~/assets/css/main.scss']
  ],
  /*
  ** Global CSS
  */
  css: ['~/assets/css/main.scss'],
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: `${process.env.PROTO || 'http'}://${process.env.SERVER_HOST || 'localhost'}:${process.env.SERVER_PORT || 3000}/api/graphql`,
        wsEndpoint: `${process.env.WS_PROTO || 'ws'}://${process.env.SERVER_HOST || 'localhost'}:${process.env.SERVER_PORT || 3000}/api/subscriptions`
      }
    }
  },
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios'],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
