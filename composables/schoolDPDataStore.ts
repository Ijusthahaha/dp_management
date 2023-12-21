import {ClassDPLog, DPType, Location, SchoolDPLog} from "~/types/DPType";
import {StudentLevel} from "~/types/User";

export const useSchoolDPDataStore = defineStore('schoolDPDataStore', () => {
    const currentYear = new Date().getFullYear()

    const rawSchoolDP: SchoolDPLog[] = [
        {
            clazz: "MRD",
            level: StudentLevel.MD,
            dpLog: [
                {
                    type: DPType["abuse of e-gadgets"],
                    dp: 3,
                    date: Date.now().toString(),
                    name: "Leo",
                    location: Location.academic
                },
                {type: DPType.bullying, dp: 3, date: '1666083175000', name: 'Leo', location: Location.academic},
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
                {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Leo", location: Location.academic}
            ]
        },
        {
            clazz: "IDK",
            level: StudentLevel.JH,
            dpLog: [
                {
                    type: DPType["abuse of e-gadgets"],
                    dp: 3,
                    date: Date.now().toString(),
                    name: "Hehe1",
                    location: Location.academic
                },
                {type: DPType.bullying, dp: 3, date: '1694265129000', name: 'Hehe2', location: Location.academic},
                {type: DPType.gambling, dp: 2, date: '1691586729000', name: "Hehe3", location: Location.academic},
                {type: DPType.others, dp: 1, date: '1688908329000', name: "Hehe4", location: Location.academic},
                {type: DPType.others, dp: 1, date: '1686316329000', name: "Hehe5", location: Location.academic},
                {type: DPType.others, dp: 1, date: '1683637929000', name: "Hehe6", location: Location.academic},
                {type: DPType.smoking, dp: 6, date: '1682946729000', name: "Hehe1", location: Location.academic},
                {type: DPType.pornography, dp: 1, date: '1682946729000', name: "Hehe2", location: Location.academic},
                {type: DPType.pornography, dp: 1, date: '1682946729000', name: "Hehe3", location: Location.academic},
                {type: DPType.pornography, dp: 2, date: '1682946729000', name: "Hehe4", location: Location.academic},
                {type: DPType.pornography, dp: 1, date: '1682946729000', name: "Hehe5", location: Location.academic},
                {type: DPType.pornography, dp: 1, date: '1682946729000', name: "Hehe6", location: Location.academic},
                {type: DPType.pornography, dp: 1, date: '1682946729000', name: "Hehe1", location: Location.academic}
            ]
        },
        {
            clazz: "YVK",
            level: StudentLevel.MD,
            dpLog: [
                {
                    type: DPType["abuse of e-gadgets"],
                    dp: 3,
                    date: Date.now().toString(),
                    name: "idk1",
                    location: Location.academic
                },
                {type: DPType.bullying, dp: 3, date: '1694265129000', name: 'idk1', location: Location.academic},
                {type: DPType.gambling, dp: 2, date: '1691586729000', name: "idk2", location: Location.academic},
                {type: DPType.others, dp: 1, date: '1688908329000', name: "idk3", location: Location.academic},
                {type: DPType.others, dp: 1, date: '1686316329000', name: "idk4", location: Location.academic},
                {type: DPType.others, dp: 1, date: '1683637929000', name: "idk5", location: Location.academic},
                {type: DPType.smoking, dp: 6, date: '1682946729000', name: "idk1", location: Location.academic},
                {
                    type: DPType["copy homework"],
                    dp: 12,
                    date: '1682946729000',
                    name: "idk2",
                    location: Location.academic
                },
                {type: DPType.theft, dp: 12, date: '1682946729000', name: "idk3", location: Location.academic},
                {type: DPType.bullying, dp: 12, date: '1682946729000', name: "idk4", location: Location.academic},
                {type: DPType.pornography, dp: 12, date: '1682946729000', name: "idk5", location: Location.academic},
                {type: DPType.truancy, dp: 12, date: '1682946729000', name: "idk1", location: Location.academic},
                {type: DPType.pornography, dp: 12, date: '1682946729000', name: "idk2", location: Location.academic}
            ]
        },
        {
            clazz: "Joseph",
            level: StudentLevel.SH,
            dpLog: []
        }
    ]

    const schoolDP: SchoolDPLog[] = []
    for (let i = 0; i < rawSchoolDP.length; i++) {
        let tinySchoolDP: ClassDPLog[] = []
        for (let j = 0; j < rawSchoolDP[i].dpLog.length; j++) {
            const date = new Date(+rawSchoolDP[i].dpLog[j].date)
            if (date && date.getFullYear() == currentYear) {
                tinySchoolDP.push(rawSchoolDP[i].dpLog[j])
            }
        }
        schoolDP.push({
            clazz: rawSchoolDP[i].clazz,
            level: rawSchoolDP[i].level,
            dpLog: tinySchoolDP
        })
    }

    const getClasses = () => {
        const classes: string[] = []
        for (let i = 0; i < rawSchoolDP.length; i++) {
            classes.push(rawSchoolDP[i].clazz)
        }
        return classes
    }

    return {
        rawSchoolDP,
        schoolDP,
        getClasses
    }
})