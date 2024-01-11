import {Student} from "~/types/User";
import {Ref} from "@vue/reactivity";

export const useStudentStore = defineStore('studentStore', () => {
    const students: Ref<Student[]> = ref([])
    return {
        students
    }
})