import {StudentLogin, TeacherLogin} from "~/types/User";
import http from "~/utils/axios";
import {Form} from "~/types/Status";

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

export function getStudents(keyword: string) {
    return http.get("//localhost:8080/student/getStudents?keyword=" + keyword)
}

export function postLogs(token: string, form: Form) {
    const d = form.detailDate.toString().split(":")
    const date = new Date(form.date)
    date.setHours(Number(d[0]))
    date.setMinutes(Number(d[1]))
    date.setSeconds(Number(d[2]))
    form.date = Date.parse(date.toString())

    return http.post("//localhost:8080/log/postLogs", {
        id: form.currentStudent.id,
        studentName: form.currentStudent.name,
        date: form.date,
        location: form.location,
        type: form.type,
        reason: form.reason,
        dp: form.dp
    }, {
        headers: {
            token
        }
    })
}

export function getPendingAppeals(token: string) {
    return http.get("//localhost:8080/appeal/getPendingAppeals", {
        headers: {
            token
        }
    })
}

export function rejectAppeals(token: string, appealId: number, appealReason: string) {
    return http.put("//localhost:8080/appeal/rejectAppeals", {
        appealId,
        appealReason
    }, {
        headers: {
            token
        }
    })
}

export function fulfillAppeals(token: string, appealId: number) {
    return http.put("//localhost:8080/appeal/fulfillAppeals", {
        appealId
    }, {
        headers: {
            token
        }
    })
}

export function getAllLogs() {
    return http.get("//localhost:8080/log/getAllLogs")
}

export function getAllLogsByClass(token: string) {
    return http.get("//localhost:8080/log/getAllLogsByClass", {
        headers: {
            token
        }
    })
}