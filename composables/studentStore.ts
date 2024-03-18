import type {Student} from "~/types/User";
import type {Ref} from "@vue/reactivity";
import type {studentDataDisplay, teacherDataDisplay} from "~/types/dataDisplay";

// not only student store.
export const useStudentStore = defineStore('studentStore', () => {
    const students: Ref<Student[]> = ref([])
    const allClasses: Ref<string[] | undefined> = ref(undefined)
    const allStudents: Ref<studentDataDisplay[] | undefined> = ref(undefined)
    const allTeachers: Ref<teacherDataDisplay[]> = ref([])
    return {
        students,
        allClasses,
        allStudents,
        allTeachers
    }
})