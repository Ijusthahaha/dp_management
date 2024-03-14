import {useUserStore} from "~/composables/userStore";
import {validateStudentJwt} from "~/utils/studentApiUtils";
import {validateTeacherJwt} from "~/utils/teacherApiUtils";

// TODO: optimise this shit
export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return

    const store = useUserStore()
    let result;

    if (from.path.includes("student")) {
        result = await validateStudentJwt(store.jwt)
    } else if (from.path.includes("teacher")) {
        result = await validateTeacherJwt(store.jwt)
    } else {
        let u = await validateStudentJwt(store.jwt)
        let v = await validateTeacherJwt(store.jwt)
        if (u) result = u
        if (v) result = v
    }

    if (result && result.status === 200) {
        navigateTo('/')
    } else {
        return navigateTo('/login/student')
    }
})