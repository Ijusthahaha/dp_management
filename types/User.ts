export interface Student {
    id: string,
    name: string,
    type: 'student',
    clazz: string // student class (e.g. MRD),
    level: StudentLevel
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

export enum StudentLevel {
    "MD" = "MD",
    "JH" = "JH",
    "SH" = "SH"
}

export enum TeacherType {
    "Default" = "Default",
    "CT" = "CT",
    "Director" = 'Director'
}

export interface StudentLogin {
    studentId: string,
    studentPassword: string
}

export interface TeacherLogin {
    teacherId: string,
    teacherPassword: string
}

// export type User = Student | Teacher | Admin | undefined