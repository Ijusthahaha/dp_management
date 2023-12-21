import {StudentLogin, TeacherLogin} from "~/types/User";
import http from "~/utils/axios";

export function studentLogin(student: StudentLogin) {
    return http.post("//localhost:8080/student/login", student);
}

export function teacherLogin(teacher: TeacherLogin) {
    return http.post("//localhost:8080/teacher/login", teacher);
}

export function getLogs(token: string) {
    return http.get("//localhost:8080/log/getLogs", {
        headers: {
            token: token
        }
    })
}

export function getCompareLogs(token: string) {
    return http.get("//localhost:8080/log/getCompareLogs", {
        headers: {
            token: token
        }
    })
}

export function createAppeals(logId: number, appealId: number, appealReason: string, token: string) {
    return http.post("//localhost:8080/appeal/createAppeals", {
        logId,
        appealId,
        appealReason
    }, {
        headers: {
            token
        }
    })
}

export function getAppeals(token: string) {
    return http.get("//localhost:8080/appeal/getAppeals", {
        headers: {
            token
        }
    })
}

export function getRawLogs(token: string) {
    return http.get("//localhost:8080/log/getRawLogs", {
        headers: {
            token
        }
    })
}

export async function checkStudentLogin(token: string) {
    return await http.get("//localhost:8080/student/checkLogin", {
        headers: {
            token
        }
    })
}

export async function checkTeacherLogin(token: string) {
    return await http.get("//localhost:8080/teacher/checkLogin", {
        headers: {
            token
        }
    })
}

export function changeStudentPassword(token: string, password: string) {
    return http.put("//localhost:8080/student/changePassword", {
        password
    }, {
        headers: {
            token
        }
    })
}