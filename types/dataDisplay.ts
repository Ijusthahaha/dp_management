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
}

export type unConvertedStudentData = Omit<studentDataDisplay, "studentClassLevel"> & { studentClassLevel: number }
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

export function studentDataConverter(data: unConvertedStudentData[]): studentDataDisplay[] {
    const tiny: studentDataDisplay[] = []
    for (let i = 0; i < data.length; i++) {
        const j = data[i]
        tiny.push({
            studentUuid: j.studentUuid,
            studentId: j.studentId,
            studentName: j.studentName,
            studentSex: j.studentSex,
            studentAge: j.studentAge,
            studentClass: j.studentClass,
            appealedCount: j.appealedCount,
            dp: j.dp,
            isExpired: j.isExpired,
            studentClassLevel: ClassLevelConverter(j.studentClassLevel)
        })
    }
    return tiny
}