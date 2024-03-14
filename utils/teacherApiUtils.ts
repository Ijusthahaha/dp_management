import type {Status} from "~/types/Status";
import {createStatus} from "~/utils/createStatus"
import {createAdmin, createTeacher} from "~/utils/createUser";
import {teacherLevelConverter} from "~/utils/ConvertLevelUtils";
import {checkTeacherLogin} from "~/utils/fetch";

export async function validateTeacherJwt(jwt: string): Promise<Status> {
    if (!jwt) return createStatus(403, "Forbidden");

    const store = useUserStore()
    try {
        const result = await checkTeacherLogin(store.jwt);
        if (result.data.code !== 200) {
            return createStatus(403, "Forbidden");
        }
        let level = teacherLevelConverter(Number(result.data.data.teacherLevel))
        if (level !== "Admin") {
            store.$patch(state => {
                state.jwt = jwt
                state.user = createTeacher(result.data.data.teacherUuid, result.data.data.teacherName, result.data.data.teacherClass, level)
            });
        } else {
            if (level === "Admin") {
                store.$patch(state => {
                    state.jwt = jwt
                    state.user = createAdmin(result.data.data.teacherUuid, result.data.data.teacherName)
                });
            } else {
                return createStatus(403, "Forbidden");
            }
        }
        console.log("Jwt successfully verified.")
        return createStatus(200, "OK");
    } catch (_) {
    }
    return createStatus(403, "Forbidden");
}