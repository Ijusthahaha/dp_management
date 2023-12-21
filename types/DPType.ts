import {Student, StudentLevel} from "~/types/User";

export enum DPType {
    'punctuality',
    'copy homework',
    'untidy attire',
    'waste resources',
    'inconsiderate behavior',
    'littering',
    'sleeping in class',
    'abuse of e-gadgets',
    'rude to peers',
    'violent behavior',
    'exploitation',
    'gambling',
    'bullying',
    'rude teachers',
    'theft',
    'forgery',
    'plagiarism',
    'cheating in exam',
    'vandalism',
    'pornography',
    'smoking',
    'alcohol abuse',
    'truancy',
    'others'
}

export enum Location {
    academic = "academic",
    dorm = "dorm"
}

export enum AppealStatus {
    NOT_APPEAL = 'Not appeal',
    PENDING = 'Pending',
    REJECTED = 'Rejected',
    FULFILLED = 'Fulfilled'
}

export interface Appeal {
    status: AppealStatus,
    reason: string
}

export interface DPLog {
    type: DPType,
    location: Location
    dp: number,
    date: string,
    appeal: Appeal | undefined,
    remark?: string
}

export interface SchoolDPLog {
    clazz: string,
    level: StudentLevel
    dpLog: ClassDPLog[]
}

// we don't need student's class because student's class is based on teacher's class.
export type ClassDPLog = Omit<DPLog, 'appeal' | 'message' | 'remark'> & Omit<Student, 'type' | 'id' | 'clazz' | 'level'>
export type MessageLog = DPLog & Omit<Student, 'type' | 'id'>