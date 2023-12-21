import {Appeal, AppealStatus} from "~/types/DPType";

export function createRawAppeal(): Appeal {
    return {
        status: AppealStatus.NOT_APPEAL,
        reason: ''
    }
}

// reason: the reason of applying appeal
export function createPendingAppeal(appeal: Appeal, reason: string): Appeal {
    return {
        status: AppealStatus.PENDING,
        reason
    }
}

// the reason of fulfilling the appeal
export function fulfillAppeal(appeal: Appeal, reason: string) {
    return {
        status: AppealStatus.FULFILLED,
        reason
    }
}

// reason: the reason of rejecting the appeal
export function rejectAppeal(appeal: Appeal, reason: string) {
    return {
        status: AppealStatus.REJECTED,
        reason
    }
}