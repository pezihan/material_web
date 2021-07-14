export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'web',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: '~/assets/css/global.scss', lang: 'scss' },
    { src: '@/assets/font/iconfont.css', lang: 'css' }
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios',
    '~/plugins/global'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt'
  ],
  buildModules: [
    '@nuxtjs/style-resources'
  ],
  styleResources: {
      scss: [
          '@/assets/my-global.scss'
      ]
  },
  axios: {
    proxy: true
  },
  proxy: {
    '/user': {
      target: 'http://127.0.0.1:5000',
      changeOrigin: true
    },
    '/public': {
      target: 'http://127.0.0.1:5000',
      changeOrigin: true
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  router: {
    middleware: 'redirect',
    extendRoutes(routes){
      routes.push({
        path:"/",
        redirect:"/home"
      },
      {
        path:"*",
        redirect:"/home"
      })
    }
  }
}
