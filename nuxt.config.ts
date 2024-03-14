// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: false},
    modules: ['@element-plus/nuxt', '@pinia/nuxt', '@vueuse/nuxt', '@nuxtjs/i18n', 'nuxt-particles'],
    pinia: {
        autoImports: [
            'defineStore',
        ],
    },
    css: ['element-plus/theme-chalk/dark/css-vars.css', '@/assets/base.css', '@/assets/monocraft.css', "nprogress/nprogress.css"],
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
    experimental: {
        treeshakeClientOnly: false,
        writeEarlyHints: false,
    }
})
