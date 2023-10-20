import {Status} from "~/types/Status";
import {createStatus} from "~/utils/createStatus"
import {TeacherType} from "~/types/User";

export function validateJWT(jwt: string): Status {
    const store = useUserStore()

    if (jwt == "cjnbdgly666") {
        store.$patch(state => {
            state.jwt = jwt
            state.user = createAdmin("01", "Hehe6")
        })
        return createStatus(200, "OK")
    }
    if (jwt == "djfhsjkndfj101") {
        store.$patch(state => {
            state.jwt = jwt
            state.user = createTeacher("01", "XRM", TeacherType.Default)
        })
        return createStatus(200, "OK")
    }
    if (jwt == "djfhsjkndfj102") {
        store.$patch(state => {
            state.jwt = jwt
            state.user = createTeacher("01", "XRM", TeacherType.CT)
        })
        return createStatus(200, "OK")
    }
    if (jwt == "djfhsjkndfj103") {
        store.$patch(state => {
            state.jwt = jwt
            state.user = createTeacher("01", "XRM", TeacherType.Director)
        })
        return createStatus(200, "OK")
    }
    if (jwt == 'ewhkdbdsfnjksdkfd189') {
        store.$patch(state => {
            state.jwt = jwt
            state.user = createStudent("01", "hehe", "MRD")
        })
        return createStatus(200, "OK")
    }
    return createStatus(403, "Forbidden")
}