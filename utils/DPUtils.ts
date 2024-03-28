import {type Appeal, type DPLog, DPType, Location} from "~/types/DPType";
import {createPendingAppeal, createRawAppeal, fulfillAppeal, rejectAppeal} from "~/utils/createAppeal";
import {type StudentLevel, TeacherType} from "~/types/User";
import type {
    studentDataDisplay,
    teacherDataDisplay,
    unConvertedStudentData,
    unConvertedTeacherData
} from "~/types/dataDisplay";

export function createDP(type: string, location: string, dp: number, date: string, remark: string): DPLog {
    return {
        type: DPConverter(type),
        location: LocationConverter(location),
        dp,
        date,
        appeal: undefined,
        remark: remark
    }
}

export function DPConverter(type: string): DPType {
    return DPType[type as keyof typeof DPType]
}

export function LocationConverter(location: string): Location {
    return Location[location.toLowerCase() as keyof typeof Location]
}

export function AppealConverter(appeal: number, reason: string): Appeal {
    if (!appeal) return createRawAppeal()
    if (appeal != 0 && appeal != 1 && appeal != 2 && appeal != 3) {
        return createRawAppeal()
    }
    if (!reason) reason = ""
    if (appeal == 0) return createRawAppeal()
    if (appeal == 1) return createPendingAppeal(createRawAppeal(), reason)
    if (appeal == 2) return fulfillAppeal(createRawAppeal(), reason)
    if (appeal == 3) return rejectAppeal(createRawAppeal(), reason)

    return createRawAppeal()
}

export function ClassLevelConverter(level: number): StudentLevel {
    if (level == 0) return <StudentLevel>"MD"
    if (level == 1) return <StudentLevel>"JH"
    if (level == 2) return <StudentLevel>"SH"
    else return <StudentLevel>"UNDEFINED"
}

export function TeacherLevelConverter(level: number): TeacherType {
    if (level == 0) return <TeacherType>"Default"
    else if (level == 1) return <TeacherType>"CT"
    else if (level == 2) return <TeacherType>"Director"
    else if (level == 3) return <TeacherType>"Admin"
    else return <TeacherType>"Default"
}

export function TeacherLevelToNumberConverter(level: TeacherType) {
    if (level === TeacherType.Default) return 0
    else if (level === TeacherType.CT) return 1
    else if (level === TeacherType.Director) return 2
    else if (level === TeacherType.Admin) return 3
    else return 0
}

export function ClassLevelConverterForEntire(obj: unConvertedStudentData[]): studentDataDisplay[] {
    const o: studentDataDisplay[] = []
    for (let i = 0; i < obj.length; i++) {
        o.push({
            ...obj[i],
            studentClassLevel: ClassLevelConverter(obj[i].studentClassLevel)
        })
    }
    return o
}

export function TeacherLevelConverterForEntire(obj: unConvertedTeacherData[]): teacherDataDisplay[] {
    const o: teacherDataDisplay[] = []
    for (let i = 0; i < obj.length; i++) {
        o.push({
            ...obj[i],
            teacherLevel: TeacherLevelConverter(obj[i].teacherLevel)
        })
    }
    return o
}

export function formatGetAllLogs(array: getAllLogFetchedResult[]): Map<string, DPLog[]> {
    const classes = new Map<string, DPLog[]>()
    for (let i = 0; i < array.length; i++) {
        if (!classes.get(array[i].class_name)) {
            // im lazy idc remark lol
            let c = createDP(array[i].log_type, array[i].log_location, array[i].dp, array[i].date, "")
            classes.set(array[i].class_name, [c])
        } else {
            let a = classes.get(array[i].class_name) as DPLog[]
            a.push(createDP(array[i].log_type, array[i].log_location, array[i].dp, array[i].date, ""))
            classes.set(array[i].class_name, a)
        }
    }
    return classes
}

export interface getAllLogFetchedResult {
    class_level: number,
    class_name: string,
    date: string
    dp: number,
    log_location: string,
    log_type: string,
    student_name: string
}