import type {getAllLogFetchedResult} from "~/utils/DPUtils";
import type {Ref} from "@vue/reactivity";

export const useSchoolDPDataStore = defineStore('schoolDPDataStore', () => {
    const currentYear = new Date().getFullYear()
    const isUpdatedDP = ref(false)

    let schoolDP: Ref<getAllLogFetchedResult[]> = ref([])
    watch(schoolDP, (newValue, oldValue) => {
        if (isUpdatedDP.value === false) {
            const dps: getAllLogFetchedResult[] = []
            schoolDP.value.forEach((value) => {
                if (value.date && new Date(value.date).getFullYear() == currentYear) {
                    dps.push(value)
                }
            })

            schoolDP.value = dps
            isUpdatedDP.value = true
        }
    })
    return {
        schoolDP, isUpdatedDP
    }
})