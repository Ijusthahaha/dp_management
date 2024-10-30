import {defineStore, skipHydrate} from "pinia";
import type {Ref} from "@vue/reactivity";
import {type Admin, type Student, type Teacher} from "~/types/User";

export const useUserStore = defineStore('userStore', () => {
    const JWT = useLocalStorage('JWT', '')
    const from = ref('')
    const User: Ref<Student | Teacher | Admin | undefined> = ref(undefined)
    const Theme = useLocalStorage('theme', 'dark')
    const currentItem = ref(0)
    const font = useLocalStorage('font', '')
    const language = useLocalStorage('language', 'en')

    const route = ref("/")
    const getRouteDepth = () => {
        const segments = route.value.replace(/^\/|\/$/g, '').split('/');
        return segments[0] === '' ? 0 : segments.length;
    }
    const popRoutePath = () => {
        const segments = route.value.replace(/^\/|\/$/g, '').split('/');
        if (segments.length <= 1) {
            route.value = '/'
        }
        segments.pop();
        route.value = '/' + segments.join('/');
    }
    const getRoutePath = (level: number) => {
        const segments = route.value.replace(/^\/|\/$/g, '').split('/');
        if (level > 0 && level <= segments.length) {
            return segments[level - 1];
        }
    }
    const gotoRoute = (n: number) => {
        let depth = getRouteDepth();
        while (depth > n) {
            popRoutePath();
            depth = getRouteDepth();
        }
    };

    return {
        user: User,
        from: from,
        jwt: skipHydrate(JWT),
        theme: skipHydrate(Theme),
        font: skipHydrate(font),
        language: skipHydrate(language),
        route,
        currentItem,
        getRouteDepth,
        popRoutePath,
        getRoutePath,
        gotoRoute
    }
})