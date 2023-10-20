import { defineStore, skipHydrate } from "pinia";
import {Ref} from "@vue/reactivity";
import {Student, Teacher, Admin, TeacherType} from "~/types/User";

export const useUserStore = defineStore('userStore', () => {
    const JWT = useLocalStorage('JWT', '')
    const User: Ref<Student | Teacher | Admin | undefined> = ref(undefined)
    const Theme = useLocalStorage('theme', 'light')
    const currentItem = ref(0)
    const font = useLocalStorage('font', '')

    return {
        user: User,
        jwt: skipHydrate(JWT),
        theme: skipHydrate(Theme),
        font: skipHydrate(font),
        currentItem
    }
})