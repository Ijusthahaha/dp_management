export const useAdminDataStore = defineStore('adminDataStore', () => {
    const activeRouteIndex = ref("Dashboard")
    return {
        activeRouteIndex
    }
})