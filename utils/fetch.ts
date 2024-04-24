import type {StudentLogin, TeacherLogin} from "~/types/User";
import http from "~/utils/axios";
import type {Form} from "~/types/Status";
import type {
    modifyStudentType,
    numberTeacherLevelTeacherDataDisplay,
    tinyClassDataDisplay,
    tinyStudentDataDisplay
} from "~/types/dataDisplay";
import type {UploadRequestOptions} from "element-plus";

export function studentLogin(student: StudentLogin) {
    return http.post("/student/login", student);
}

export function teacherLogin(teacher: TeacherLogin) {
    return http.post("/teacher/login", teacher);
}

export function getLogs(token: string) {
    return http.get("/log/getLogs", {
        headers: {
            token: token
        }
    })
}

export function getCompareLogs(token: string) {
    return http.get("/log/getCompareLogs", {
        headers: {
            token: token
        }
    })
}

export function createAppeals(logId: number, appealId: number, appealReason: string, token: string) {
    return http.post("/appeal/createAppeals", {
        logId, appealId, appealReason
    }, {
        headers: {
            token
        }
    })
}

export function getAppeals(token: string) {
    return http.get("/appeal/getAppeals", {
        headers: {
            token
        }
    })
}

export function getRawLogs(token: string) {
    return http.get("/log/getRawLogs", {
        headers: {
            token
        }
    })
}

export async function checkStudentLogin(token: string) {
    return await http.get("/student/checkLogin", {
        headers: {
            token
        }
    })
}

export async function checkTeacherLogin(token: string) {
    return await http.get("/teacher/checkLogin", {
        headers: {
            token
        }
    })
}

export function changeStudentPassword(token: string, password: string) {
    return http.put("/student/changePassword", {
        password
    }, {
        headers: {
            token
        }
    })
}

// you can get this data without auth.
export function getStudents(keyword: string) {
    return http.get("/student/getStudents?keyword=" + keyword)
}

export function getAllClassStudents(keyword: string) {
    return http.get("/student/getAllClassStudents?className=" + keyword)
}

export function postLogs(token: string, form: Form) {
    const d = form.detailDate.toString().split(":")
    const date = new Date(form.date)
    date.setHours(Number(d[0]))
    date.setMinutes(Number(d[1]))
    date.setSeconds(Number(d[2]))
    form.date = Date.parse(date.toString())

    return http.post("/log/postLogs", {
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
    return http.get("/appeal/getPendingAppeals", {
        headers: {
            token
        }
    })
}

export function rejectAppeals(token: string, appealId: number, appealReason: string) {
    return http.put("/appeal/rejectAppeals", {
        appealId, appealReason
    }, {
        headers: {
            token
        }
    })
}

export function fulfillAppeals(token: string, appealId: number) {
    return http.put("/appeal/fulfillAppeals", {
        appealId
    }, {
        headers: {
            token
        }
    })
}

export function getAllLogs() {
    return http.get("/log/getAllLogs")
}

export function getAllLogsByClass(token: string) {
    return http.get("/log/getAllLogsByClass", {
        headers: {
            token
        }
    })
}

/**
 * @deprecated use getAllClassesV2
 */
export function getAllClasses() {
    return http.get("/student/getAllClasses")
}

export function getAllClassesV2() {
    return http.get("/class/getAllClasses")
}

export function getClassData(classId: number) {
    return http.get("/class/getClassData?classId=" + classId)
}

export function insertStudent(token: string, studentDataDisplay: tinyStudentDataDisplay) {
    return http.put("/student/insertStudent", studentDataDisplay, {
        headers: {
            token
        }
    })
}

export function insertTeacher(token: string, teacherDataDisplay: numberTeacherLevelTeacherDataDisplay) {
    return http.put("/teacher/insertTeacher", teacherDataDisplay, {
        headers: {
            token
        }
    })
}

const adminFirstLoadFetch: string[] = ["/student/getTotalStudent", "/teacher/getTotalTeacher", "/class/getTotalClass", "/log/getTotalDp", "/log/getYesterdayDp"]

export function getAdminDashboardData() {
    return Promise.all(adminFirstLoadFetch.map(f => http.get(f))).then(value => {
        return value
    })
}

export function importStudentTable(token: string, form: UploadRequestOptions) {
    const formData = new FormData()
    formData.append(form.filename, form.file)

    return http.post("/student/uploadStudentExcel", formData, {
        headers: {
            token
        }
    })
}

export function importTeacherTable(token: string, form: UploadRequestOptions) {
    const formData = new FormData()
    formData.append(form.filename, form.file)

    return http.post("/teacher/uploadTeacherExcel", formData, {
        headers: {
            token
        }
    })
}

export function importClassTable(token: string, form: UploadRequestOptions, className: string) {
    const formData = new FormData()
    formData.append(form.filename, form.file)

    return http.post("/class/uploadClassExcel", formData, {
        headers: {
            token,
            className
        }
    })
}

export function exportStudentTable(token: string) {
    return http.get("/student/getStudentExcel", {
        headers: {
            token
        }, responseType: 'blob'
    })
}

export function exportTeacherTable(token: string) {
    return http.get("/teacher/getTeacherExcel", {
        headers: {
            token
        }, responseType: "blob"
    })
}

export function exportClassTable(token: string) {
    return http.get("/class/getClassExcel", {
        headers: {
            token
        }, responseType: 'blob'
    })
}

export function modifyStudent(token: string, student: modifyStudentType) {
    return http.put("/student/modifyStudent", student, {
        headers: {
            token
        }
    })
}

export function modifyTeacher(token: string, teacher: numberTeacherLevelTeacherDataDisplay) {
    return http.put("/teacher/modifyTeacher", teacher, {
        headers: {
            token
        }
    })
}

export function deleteTeacher(token: string, uuid: number) {
    return http.delete("/teacher/deleteTeacher", {
        headers: {
            token, id: uuid
        }
    })
}

export function getAllTeachers(token: string) {
    return http.get("/teacher/getAllTeachers", {
        headers: {
            token
        }
    })
}

export function createClass(token: string, c: tinyClassDataDisplay) {
    return http.put("/class/createClass", c, {
        headers: {
            token
        }
    })
}

export function deleteClass(token: string, classId: number) {
    return http.delete("/class/deleteClass", {
        headers: {
            token, classId
        }
    })
}

export function getTopDpStudents(token: string) {
    return http.get("/student/getTopDpStudents", {
        headers: {
            token
        }
    })
}

export function getTopDpTeachers(token: string) {
    return http.get("/teacher/getTopDpTeachers", {
        headers: {
            token
        }
    })
}