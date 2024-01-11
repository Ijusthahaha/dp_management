export type Status = {
    status: number,
    message: Error | string
}

export type ComparedLog = {
    logName: string,
    logDP: number
}

export interface Form {
    currentStudent: {
        name: string,
        id: number | undefined
    },
    date: number,
    detailDate: number,
    location: string,
    type: string | undefined,
    reason: string,
    dp: number
}