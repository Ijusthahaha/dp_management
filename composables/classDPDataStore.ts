import {ClassDPLog, DPType, Location} from "~/types/DPType";

export const useClassDPDataStore = defineStore('classDPDataStore', () => {
    // only init in teacher client
    const currentYear = new Date().getFullYear()

    // get specific class's dp. (e.g. MRD)
    // notice: this data will be fetched after obtained the class that teacher manage.
    const rawClassDP: ClassDPLog[] = [
        {
            type: DPType["abuse of e-gadgets"],
            dp: 3,
            date: Date.now().toString(),
            name: 'Leo',
            location: Location.academic
        },
        {type: DPType.bullying, dp: 3, date: '1694265129000', name: 'Leo', location: Location.academic},
        {type: DPType.gambling, dp: 2, date: '1691586729000', name: "Leo", location: Location.academic},
        {type: DPType.others, dp: 1, date: '1688908329000', name: "Vincent", location: Location.academic},
        {type: DPType.others, dp: 1, date: '1686316329000', name: "Allen", location: Location.academic},
        {type: DPType.others, dp: 1, date: '1683637929000', name: "Joseph", location: Location.academic},
        {type: DPType.smoking, dp: 6, date: '1682946729000', name: "Hita", location: Location.academic},
        {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Brian", location: Location.academic},
        {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Gay", location: Location.academic},
        {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Keven", location: Location.academic},
        {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Tommy", location: Location.academic},
        {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Simba", location: Location.academic},
        {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Leo", location: Location.academic},
    ]

    const classDP: ClassDPLog[] = []
    for (let i = 0; i < rawClassDP.length; i++) {
        const date = new Date(+rawClassDP[i].date)
        if (date && date.getFullYear() == currentYear) {
            classDP.push(rawClassDP[i])
        }
    }

    return {
        rawClassDP,
        classDP
    }
})