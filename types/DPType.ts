import type {Student, StudentLevel} from "~/types/User";

export enum Location {
    academic = "academic",
    dorm = "dorm"
}

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
    'rude to teacher',
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

// Location.academic == academic + dorm; Location.dorm == dorm
export const DPTypeExtraInfo: { [key in DPType]: { suggestion?: number, location: Location } } = {
    [DPType.punctuality]: {suggestion: 1, location: Location.academic},
    [DPType["copy homework"]]: {suggestion: 1, location: Location.academic},
    [DPType["untidy attire"]]: {suggestion: 1, location: Location.academic},
    [DPType["waste resources"]]: {suggestion: 1, location: Location.dorm},
    [DPType["inconsiderate behavior"]]: {suggestion: 1, location: Location.dorm},
    [DPType.littering]: {suggestion: 1, location: Location.dorm},
    [DPType["sleeping in class"]]: {suggestion: 1, location: Location.academic},
    [DPType["abuse of e-gadgets"]]: {suggestion: 2, location: Location.dorm},
    [DPType["rude to peers"]]: {suggestion: 3, location: Location.dorm},
    [DPType["violent behavior"]]: {suggestion: 4, location: Location.dorm},
    [DPType.exploitation]: {suggestion: 4, location: Location.dorm},
    [DPType.gambling]: {suggestion: 3, location: Location.dorm},
    [DPType.bullying]: {suggestion: 6, location: Location.dorm},
    [DPType["rude to teacher"]]: {suggestion: 6, location: Location.dorm},
    [DPType.theft]: {suggestion: 6, location: Location.dorm},
    [DPType.forgery]: {suggestion: 6, location: Location.dorm},
    [DPType.plagiarism]: {suggestion: 6, location: Location.dorm},
    [DPType["cheating in exam"]]: {suggestion: 6, location: Location.academic},
    [DPType.vandalism]: {suggestion: 6, location: Location.dorm},
    [DPType.pornography]: {suggestion: 6, location: Location.dorm},
    [DPType.smoking]: {suggestion: 6, location: Location.dorm},
    [DPType["alcohol abuse"]]: {suggestion: 6, location: Location.dorm},
    [DPType.truancy]: {suggestion: 6, location: Location.dorm},
    [DPType.others]: {location: Location.dorm}
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