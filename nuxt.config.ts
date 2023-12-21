// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: ['@element-plus/nuxt', '@pinia/nuxt', '@vueuse/nuxt', '@nuxtjs/i18n',],
    pinia: {
        autoImports: [
            'defineStore',
        ],
    },
    css: ['element-plus/theme-chalk/dark/css-vars.css', '@/assets/base.css', '@/assets/monocraft.css'],
    app: {
        head: {
            title: 'Student DP Management System',
            charset: 'utf-8',
            meta: [
                {name: 'description', content: 'Student DP Management System'}
            ],
            link: [{rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'}]
        },
    },
    i18n: {
        vueI18n: '@/config/i18n.config.ts'
    },
    nitro: {
        devProxy: {
            "/api": {
                target: "//localhost:8080/",
                changeOrigin: true
            }
        }
    }
})
