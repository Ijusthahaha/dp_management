import type {DPLog} from "~/types/DPType";
import type {Ref} from "@vue/reactivity";
import type {ComparedLog} from "~/types/Status";
import {AppealStatus} from "~/types/DPType";

export const useDPDataStore = defineStore('dpDataStore', () => {
    const currentYear = new Date().getFullYear()

    // single student's dp.
    const rawUserDP: Ref<DPLog[]> = ref([])
    // {type: DPType["abuse of e-gadgets"], dp:3, location: Location.academic, date: Date.now().toString(), appeal: createPendingAppeal(createRawAppeal(), '...')},

    const averageDP: Ref<ComparedLog[]> = ref([])

    // remove the outdated DP.
    const computedUserDP: Ref<DPLog[]> = ref([])
    const isUpdatedDP = ref(false)
    const shouldBeUpdate = ref(0)
    watch(rawUserDP, (newValue, oldValue) => {
        const d = []

        for (let i = 0; i < newValue.length; i++) {
            const date = new Date(newValue[i].date)
            if (date && date.getFullYear() == currentYear) {
                // if (newValue[i].appeal.status !== AppealStatus.FULFILLED) {
                //     computedUserDP.value.push(newValue[i])
                // }
                d.push(newValue[i])
            }
        }
        computedUserDP.value = d
        isUpdatedDP.value = !isUpdatedDP.value
    })

    const availableDP = toRef(() => computedUserDP.value.filter(v => v.appeal?.status !== AppealStatus.FULFILLED))

    const getTotalDP = computed(() => {
        let total = 0
        computedUserDP.value.forEach(v => {
            if (v.appeal?.status !== AppealStatus.FULFILLED) {
                total = total + v.dp
            }
        })
        return total
    })

    return {
        rawUserDP,
        computedUserDP,
        availableDP,
        averageDP,
        getTotalDP,
        isUpdatedDP,
        shouldBeUpdate
    }
})