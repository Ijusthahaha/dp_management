import {defineStore, skipHydrate} from "pinia";
import type {Ref} from "@vue/reactivity";
import {type Admin, type Student, type Teacher} from "~/types/User";

export const useUserStore = defineStore('userStore', () => {
    const JWT = useLocalStorage('JWT', '')
    const User: Ref<Student | Teacher | Admin | undefined> = ref(undefined)
    const Theme = useLocalStorage('theme', 'dark')
    const currentItem = ref(0)
    const font = useLocalStorage('font', '')
    const language = useLocalStorage('language', 'en')

    return {
        user: User,
        jwt: skipHydrate(JWT),
        theme: skipHydrate(Theme),
        font: skipHydrate(font),
        language: skipHydrate(language),
        currentItem
    }
})