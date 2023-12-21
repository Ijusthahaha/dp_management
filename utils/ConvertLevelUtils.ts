import {TeacherType} from "~/types/User";

export function teacherLevelConverter(i: number): TeacherType {
    if (i === 0) {
        return TeacherType.Default
    } else if (i === 1) {
        return TeacherType.CT
    } else if (i === 2) {
        return TeacherType.Director
    } else if (i === 3) {
        // TODO: admin!
    }
    return TeacherType.Default
}