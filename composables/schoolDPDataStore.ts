import type {getAllLogFetchedResult} from "~/utils/DPUtils";
import type {Ref} from "@vue/reactivity";

export const useSchoolDPDataStore = defineStore('schoolDPDataStore', () => {
    const currentYear = new Date().getFullYear()

    /*
    {
            clazz: "MRD",
            level: StudentLevel.MD,
            dpLog: [
                {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Leo", location: Location.academic}
            ]
        },
        {...}
     */
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