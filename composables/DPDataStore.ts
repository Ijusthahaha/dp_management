import type {DPLog} from "~/types/DPType";
import type {Ref} from "@vue/reactivity";
import type {ComparedLog} from "~/types/Status";
import {AppealStatus} from "~/types/DPType";

export const useDPDataStore = defineStore('dpDataStore', () => {
    // single student's dp.
    const rawUserDP: Ref<DPLog[]> = ref([])
    // {type: DPType["abuse of e-gadgets"], dp:3, location: Location.academic, date: Date.now().toString(), appeal: createPendingAppeal(createRawAppeal(), '...')},

    const averageDP: Ref<ComparedLog[]> = ref([])

    const isUpdatedDP = ref(false)
    const shouldBeUpdate = ref(0)
    watch(rawUserDP, () => {
        isUpdatedDP.value = !isUpdatedDP.value
    })

    const availableDP = toRef(() => rawUserDP.value.filter(v => v.appeal?.status !== AppealStatus.FULFILLED))

    const getTotalDP = computed(() => {
        let total = 0
        rawUserDP.value.forEach(v => {
            if (v.appeal?.status !== AppealStatus.FULFILLED) {
                total = total + v.dp
            }
        })
        return total
    })

    return {
        rawUserDP,
        availableDP,
        averageDP,
        getTotalDP,
        isUpdatedDP,
        shouldBeUpdate
    }
})