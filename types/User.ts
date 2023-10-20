export interface Student {
    id: string,
    name: string,
    type: 'student',
    clazz: string // student class (e.g. MRD)
}

export interface Teacher {
    id: string,
    name: string,
    type: 'teacher',
    clazz: string, // the class that teacher manage (e.g. MRD)
    level: TeacherType // the permission of teacher
}

export interface Admin {
    id: string,
    name: string,
    type: 'admin'
}

export enum TeacherType {
    "Default" = "Default",
    "CT" = "CT",
    "Director" = 'Director'
}

// export type User = Student | Teacher | Admin | undefined