import type {Admin, Student, StudentLevel, Teacher, TeacherType} from "~/types/User";

export function createStudent(id: string, name: string, clazz: string, level: StudentLevel | undefined): Student {
    return {
        id,
        name,
        type: "student",
        clazz,
        level: level ? level : undefined
    }
}

export function createTeacher(id: string, name: string, clazz: string, level: TeacherType): Teacher {
    return {
        id,
        name,
        type: "teacher",
        level,
        clazz
    }
}

export function createAdmin(id: string, name: string): Admin {
    return {
        id,
        name,
        type: "admin"
    }
}