import {useUserStore} from "~/composables/userStore";
import {validateJWT} from "~/utils/validateJWT";

export default defineNuxtRouteMiddleware(async (to, from)=> {
    if (process.server) return

    const store = useUserStore()

    const result = validateJWT(store.jwt)
    if (result.status == 200) {
        navigateTo('/')
    }else {
        return navigateTo('/login/student')
    }
})