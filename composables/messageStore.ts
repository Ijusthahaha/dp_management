import {MessageLog} from "~/types/DPType";
import {Ref} from "@vue/reactivity";

export const useMessageStore = defineStore('messageStore', () => {

    // we don't use any store's data because they are not complete.
    const messages: Ref<MessageLog[]> = ref([])

    const deleteMessage = (index: number) => {
        messages.value = messages.value.filter((v, i) => {
            return i != index
        })
    }

    return {
        messages, deleteMessage
    }
})