import type {Student} from "~/types/User";
import type {Ref} from "@vue/reactivity";
import type {studentDataDisplay} from "~/types/dataDisplay";

export const useStudentStore = defineStore('studentStore', () => {
    const students: Ref<Student[]> = ref([])
    const allClasses: Ref<string[] | undefined> = ref(undefined)
    const allStudents: Ref<studentDataDisplay[] | undefined> = ref(undefined)
    return {
        students,
        allClasses,
        allStudents
    }
})