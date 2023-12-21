import {Student, StudentLevel} from "~/types/User";

export const useStudentStore = defineStore('studentStore', () => {
    const students: Student[] = [
        createStudent("202130101", "Allen", "MRD", StudentLevel.MD),
        createStudent("202130102", "Vincent", "MRD", StudentLevel.MD),
        createStudent("202130103", "IDK", "idk", StudentLevel.JH),
        createStudent("202130104", "IDK2", "idk", StudentLevel.SH),
        createStudent("202130105", "IDK3", "idk", StudentLevel.JH),
        createStudent("202130106", "IDK4", "idk", StudentLevel.SH),
        createStudent("202130107", "IDK5", "idk", StudentLevel.JH),
        createStudent("202130108", "IDK6", "idk", StudentLevel.MD),
        createStudent("202130109", "Leo", "MRD", StudentLevel.MD)
    ]
    return {
        students
    }
})