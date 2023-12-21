import {Appeal, DPLog, DPType, Location} from "~/types/DPType";
import {createPendingAppeal, createRawAppeal, fulfillAppeal, rejectAppeal} from "~/utils/createAppeal";

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