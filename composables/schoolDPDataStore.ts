import {ClassDPLog, DPType, SchoolDPLog} from "~/types/DPType";

export const useSchoolDPDataStore = defineStore('schoolDPDataStore', () => {
    const currentYear = new Date().getFullYear()

    const rawSchoolDP: SchoolDPLog[] = [
        {
            clazz: "MRD",
            dpLog: [
                {type: DPType["abuse of e-gadgets"], dp: 3, date: Date.now().toString(), name: "Leo"},
                {type: DPType.bullying, dp: 3, date: '1666083175000', name: 'Leo'},
                {type: DPType.gambling, dp: 2, date: '1691586729000', name: "Leo"},
                {type: DPType.others, dp: 1, date: '1688908329000', name: "Vincent"},
                {type: DPType.others, dp: 1, date: '1686316329000', name: "Allen"},
                {type: DPType.others, dp: 1, date: '1683637929000', name: "Joseph"},
                {type: DPType.smoking, dp: 6, date: '1682946729000', name: "Hita"},
                {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Brian"},
                {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Gay"},
                {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Keven"},
                {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Tommy"},
                {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Simba"},
                {type: DPType.pornography, dp: 12, date: '1682946729000', name: "Leo"}
            ]
        },
        {
            clazz: "IDK",
            dpLog: [
                {type: DPType["abuse of e-gadgets"], dp: 3, date: Date.now().toString(), name: "Hehe1"},
                {type: DPType.bullying, dp: 3, date: '1694265129000', name: 'Hehe2'},
                {type: DPType.gambling, dp: 2, date: '1691586729000', name: "Hehe3"},
                {type: DPType.others, dp: 1, date: '1688908329000', name: "Hehe4"},
                {type: DPType.others, dp: 1, date: '1686316329000', name: "Hehe5"},
                {type: DPType.others, dp: 1, date: '1683637929000', name: "Hehe6"},
                {type: DPType.smoking, dp: 6, date: '1682946729000', name: "Hehe1"},
                {type: DPType.pornography, dp: 1, date: '1682946729000', name: "Hehe2"},
                {type: DPType.pornography, dp: 1, date: '1682946729000', name: "Hehe3"},
                {type: DPType.pornography, dp: 2, date: '1682946729000', name: "Hehe4"},
                {type: DPType.pornography, dp: 1, date: '1682946729000', name: "Hehe5"},
                {type: DPType.pornography, dp: 1, date: '1682946729000', name: "Hehe6"},
                {type: DPType.pornography, dp: 1, date: '1682946729000', name: "Hehe1"}
            ]
        },
        {
            clazz: "YVK",
            dpLog: [
                {type: DPType["abuse of e-gadgets"], dp: 3, date: Date.now().toString(), name: "idk1"},
                {type: DPType.bullying, dp: 3, date: '1694265129000', name: 'idk1'},
                {type: DPType.gambling, dp: 2, date: '1691586729000', name: "idk2"},
                {type: DPType.others, dp: 1, date: '1688908329000', name: "idk3"},
                {type: DPType.others, dp: 1, date: '1686316329000', name: "idk4"},
                {type: DPType.others, dp: 1, date: '1683637929000', name: "idk5"},
                {type: DPType.smoking, dp: 6, date: '1682946729000', name: "idk1"},
                {type: DPType["copy homework"], dp: 12, date: '1682946729000', name: "idk2"},
                {type: DPType.theft, dp: 12, date: '1682946729000', name: "idk3"},
                {type: DPType.bullying, dp: 12, date: '1682946729000', name: "idk4"},
                {type: DPType.pornography, dp: 12, date: '1682946729000', name: "idk5"},
                {type: DPType.truancy, dp: 12, date: '1682946729000', name: "idk1"},
                {type: DPType.pornography, dp: 12, date: '1682946729000', name: "idk2"}
            ]
        }
    ]

    const schoolDP: SchoolDPLog[] = []
    for (let i = 0; i < rawSchoolDP.length; i++) {
        let tinySchoolDP: ClassDPLog[] = []
        for (let j=0; j<rawSchoolDP[i].dpLog.length; j++) {
            const date = new Date(+rawSchoolDP[i].dpLog[j].date)
            if (date && date.getFullYear() == currentYear) {
                tinySchoolDP.push(rawSchoolDP[i].dpLog[j])
            }
        }
        schoolDP.push({
            clazz: rawSchoolDP[i].clazz,
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