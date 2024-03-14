import type {ClassDPLog} from "~/types/DPType";
import type {Ref} from "@vue/reactivity";

export const useClassDPDataStore = defineStore('classDPDataStore', () => {
    // only init in teacher client
    const currentYear = new Date().getFullYear()
    const isUpdatedDP = ref(false)

    // get specific class's dp. (e.g. MRD)
    // {type: DPType.bullying, dp: 3, date: '1694265129000', name: 'Leo', location: Location.academic},
    const classDP: Ref<ClassDPLog[]> = ref([])

    watch(classDP, (newValue, oldValue) => {
        if (isUpdatedDP.value === false) {
            const dps: ClassDPLog[] = []
            classDP.value.forEach((value) => {
                if (value.date && new Date(value.date).getFullYear() == currentYear) {
                    dps.push(value)
                }
            })

            classDP.value = dps
            isUpdatedDP.value = true
        }
    })


    return {
        classDP,
        isUpdatedDP
    }
})