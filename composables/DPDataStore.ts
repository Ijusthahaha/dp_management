import {DPLog} from "~/types/DPType";
import {Ref} from "@vue/reactivity";
import {ComparedLog} from "~/types/Status";

export const useDPDataStore = defineStore('dpDataStore', () => {
    const currentYear = new Date().getFullYear()

    // single student's dp.
    const rawUserDP: Ref<DPLog[]> = ref([])
    // {type: DPType["abuse of e-gadgets"], dp:3, location: Location.academic, date: Date.now().toString(), appeal: createPendingAppeal(createRawAppeal(), '...')},

    const averageDP: Ref<ComparedLog[]> = ref([])

    // remove the outdated DP.

    // const userDP: Ref<DPLog[]> = ref([])
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
                // userDP.value.push(newValue[i])
            }
        }
        computedUserDP.value = d
        isUpdatedDP.value = !isUpdatedDP.value
    })

    const getTotalDP = computed(() => {
        let total = 0
        computedUserDP.value.forEach(v => {
            total = total + v.dp
        })
        return total
    })

    return {
        rawUserDP,
        // userDP,
        computedUserDP,
        averageDP,
        getTotalDP,
        isUpdatedDP,
        shouldBeUpdate
    }
})