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
    teacherClass: string,
    teacherLevel: TeacherType
}

export interface classDataDisplay {
    classId: number,
    className: string,
    classLevel: number
}

export type unConvertedStudentData = Omit<studentDataDisplay, "studentClassLevel"> & { studentClassLevel: number }
export type unConvertedTeacherData = Omit<teacherDataDisplay, "teacherLevel"> & { teacherLevel: number }
export type tinyStudentDataDisplay = Omit<studentDataDisplay, "studentUuid" | "studentId" | "appealedCount" | "isExpired" | "dp">
export type tinyTeacherDataDisplay = Omit<teacherDataDisplay, "teacherId">
export type tinyClassDataDisplay = Omit<classDataDisplay, "classId" | "classLevel" & { classLevel: number }>
export type numberTeacherLevelTeacherDataDisplay = Omit<modifyTeacherType, "teacherLevel"> & { teacherLevel: number }

export interface modifyStudentType {
    studentName: string,
    studentClass: string,
    studentSex: string,
    studentAge: number,
    isExpired: number,

    modifyStudentId: boolean,
    modifyStudentPassword: boolean
}

export interface modifyTeacherType {
    teacherUuid: number,
    teacherName: string,
    teacherClass: string,
    teacherLevel: TeacherType,

    modifyTeacherPassword: boolean
}

export interface operationType {
    createTime: string,
    description: string,
    id: string,
    method: string,
    module: string,
    requestParam: string,
    responseParam: string,
    type: string,
    uri: string,
    userId: string
}