import {Student} from "~/types/User";

export const useStudentStore = defineStore('studentStore', () => {
    const students: Student[] = [
        createStudent("202130101", "Allen", "MRD"),
        createStudent("202130102", "Vincent", "MRD"),
        createStudent("202130103", "IDK", "idk"),
        createStudent("202130104", "IDK2", "idk"),
        createStudent("202130105", "IDK3", "idk"),
        createStudent("202130106", "IDK4", "idk"),
        createStudent("202130107", "IDK5", "idk"),
        createStudent("202130108", "IDK6", "idk"),
        createStudent("202130109", "Leo", "MRD")
    ]
    return {
        students
    }
})