import {AppealStatus, DPLog, DPType} from "~/types/DPType";
import {createPendingAppeal, createRawAppeal, fulfillAppeal, rejectAppeal} from "~/utils/createAppeal"

export const useDPDataStore = defineStore('dpDataStore', () => {
    const currentYear = new Date().getFullYear()

    // single student's dp.
    const rawUserDP: DPLog[] = [
        {type: DPType["abuse of e-gadgets"], dp:3, date: Date.now().toString(), appeal: createPendingAppeal(createRawAppeal(), '...')},
        {type: DPType.bullying, dp:3, date: '1694265129000', appeal: createRawAppeal()},
        {type: DPType.gambling, dp:2, date: '1691586729000', appeal: createRawAppeal()},
        {type: DPType.others, dp:1, date: '1688908329000', appeal: fulfillAppeal(createPendingAppeal(createRawAppeal(), '...'), 'idk')},
        {type: DPType.others, dp:1, date: '1686316329000', appeal: fulfillAppeal(createPendingAppeal(createRawAppeal(), '...'), 'idk')},
        {type: DPType.others, dp:1, date: '1683637929000', appeal: createRawAppeal()},
        {type: DPType.smoking, dp:6, date: '1682946729000', appeal: createRawAppeal()},
        {type: DPType.pornography, dp:12, date: '1682946729000', appeal: rejectAppeal(createPendingAppeal(createRawAppeal(), '...'), 'lol')},
    ]

    //TODO: get monthly average dp from database.
    const averageDP: number[] = [1, 2, 3, 4, 5, 6]

    // remove the outdated DP.
    const userDP: DPLog[] = []
    const computedUserDP: DPLog[] = []
    for (let i = 0; i<rawUserDP.length; i++) {
        const date = new Date(+rawUserDP[i].date)
        if (date && date.getFullYear() == currentYear) {
            if (rawUserDP[i].appeal.status !== AppealStatus.FULFILLED) {
                computedUserDP.push(rawUserDP[i])
            }
            userDP.push(rawUserDP[i])
        }
    }

    const getTotalDP = computed(() => {
        let total = 0
        computedUserDP.forEach(v => {
            total = total + v.dp
        })
        return total
    })

    return {
        userDP,
        computedUserDP,
        averageDP,
        getTotalDP
    }
})