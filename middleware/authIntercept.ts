import {useUserStore} from "~/composables/userStore";
import {validateStudentJwt} from "~/utils/studentApiUtils";
import {validateTeacherJwt} from "~/utils/teacherApiUtils";
import {jwtDecode} from "jwt-decode";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return

    const store = useUserStore()
    let result;

    try {
        const decoded = jwtDecode(store.jwt)
        if (decoded.aud) {
            if (decoded.aud[0] === "student") {
                result = await validateStudentJwt(store.jwt)
            } else if (decoded.aud[0] === "teacher") {
                result = await validateTeacherJwt(store.jwt)
            }
        }

        let query = '?'
        if (result && result.status === 200) {
            navigateTo('/', {redirectCode: 301})
        } else {
            return navigateTo('/login/student' + query)
        }
    } catch (e) {
        return navigateTo('/login/student')
    }
})