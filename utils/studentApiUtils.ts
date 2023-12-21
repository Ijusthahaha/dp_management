import {Status} from "~/types/Status";
import {createStatus} from "~/utils/createStatus"
import {createStudent} from "~/utils/createUser";
import {checkStudentLogin} from "~/utils/fetch";

export async function validateStudentJwt(jwt: string): Promise<Status> {
    if (!jwt) return createStatus(403, "Forbidden");

    const store = useUserStore()
    try {
        const result = await checkStudentLogin(store.jwt);
        if (result.data.code !== 200) {
            return createStatus(403, "Forbidden");
        }
        store.$patch(state => {
            state.jwt = jwt
            state.user = createStudent(result.data.data.studentUuid, result.data.data.studentName, result.data.data.studentClass, result.data.data.studentLevel)
        });
        console.log("Jwt successfully verified.")
        return createStatus(200, "OK");
    } catch (_) {
    }
    return createStatus(403, "Forbidden");
}