import {Student, Teacher, Admin, TeacherType} from "~/types/User";

export function createStudent(id: string, name: string, clazz: string): Student {
    return {
        id,
        name,
        type: "student",
        clazz
    }
}

export function createTeacher(id: string, name: string, level: TeacherType): Teacher {
    return {
        id,
        name,
        type: "teacher",
        level
    }
}

export function createAdmin(id: string, name: string): Admin {
    return {
        id,
        name,
        type: "admin"
    }
}