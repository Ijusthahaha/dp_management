import {AppealStatus, DPType, MessageLog} from "~/types/DPType";
import {useDPDataStore} from "~/composables/DPDataStore"
import {createPendingAppeal, createRawAppeal, fulfillAppeal, rejectAppeal} from "~/utils/createAppeal";

export const useMessageStore = defineStore('messageStore', () => {

    // we don't use any store's data because they are not complete.
    const messages: Ref<MessageLog[]> = ref([
        {type: DPType["abuse of e-gadgets"], dp:3, date: Date.now().toString(), appeal: createPendingAppeal(createRawAppeal(), '...'), name: 'Leo', clazz: "MRD"},
        {type: DPType.bullying, dp:3, date: '1694265129000', appeal: createRawAppeal(), name: 'Vincent', clazz: "MRD"},
        {type: DPType.gambling, dp:2, date: '1691586729000', appeal: createRawAppeal(), name: 'Vincent', clazz: "MRD"},
        {type: DPType.others, dp:1, date: '1688908329000', appeal: fulfillAppeal(createPendingAppeal(createRawAppeal(), '...'), 'idk'), name: 'Leo', clazz: "MRD"},
        {type: DPType.others, dp:1, date: '1686316329000', appeal: fulfillAppeal(createPendingAppeal(createRawAppeal(), '...'), 'idk'), name: 'Leo', clazz: "MRD"},
        {type: DPType.others, dp:1, date: '1683637929000', appeal: createPendingAppeal(createRawAppeal(), '...'), name: 'Vincent', clazz: "MRD"},
        {type: DPType.smoking, dp:6, date: '1682946729000', appeal: createPendingAppeal(createRawAppeal(), '...'), name: 'Hehe', clazz: "idk"},
        {type: DPType.pornography, dp:12, date: '1682946729000', appeal: rejectAppeal(createPendingAppeal(createRawAppeal(), '...'), 'lol'), name: 'Hehe', clazz: "idk"},
    ].filter(value => {
        return value.appeal.status === AppealStatus.PENDING
    }))

    const deleteMessage = (index: number) => {
        messages.value = messages.value.filter((v, i) => {
            return i != index
        })
    }

    return {
        messages,
        deleteMessage
    }
})