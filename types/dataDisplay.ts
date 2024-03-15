import type {TeacherType} from "~/types/User";

export interface studentDataDisplay {
    studentUuid: number,
    studentId: number,
    studentName: string,
    studentClass: string,
    studentClassLevel: string,
    studentSex: string,
    studentAge: number,
    appealedCount: number,
    isExpired: number,
    dp: number
}

export interface teacherDataDisplay {
    teacherUuid: number,
    teacherId: number,
    teacherName: string,
    teacherClass: number,
    teacherLevel: TeacherType
}

export type unConvertedStudentData = Omit<studentDataDisplay, "studentClassLevel"> & { studentClassLevel: number }
export type unConvertedTeacherData = Omit<teacherDataDisplay, "teacherLevel"> & { teacherLevel: number }
export type tinyStudentDataDisplay = Omit<studentDataDisplay, "studentUuid" | "studentId" | "appealedCount" | "isExpired" | "dp">

export interface modifyStudentType {
    studentName: string,
    studentClass: string,
    studentSex: string,
    studentAge: number,
    isExpired: number,

    modifyStudentId: boolean,
    modifyStudentPassword: boolean
}