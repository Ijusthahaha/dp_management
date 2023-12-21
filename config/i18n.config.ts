import en from "../locales/en.json"
import zh from "../locales/zh.json"

export default defineI18nConfig(() => ({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        zh
    }
}))