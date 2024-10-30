<script lang="ts" setup>
import {ArrowRight} from "@element-plus/icons-vue";
import type {classDataDisplay, studentDataDisplay} from "~/types/dataDisplay";
import type {AppealStatus} from "~/types/DPType";

const store = useUserStore()

interface TableContent {
  studentName: string,
  studentSex?: string,
  studentAge?: number,
  studentId?: number
}

interface DpContent {
  appeal: AppealStatus,
  date: string,
  dp: number,
  logLocation: string,
  logType: string,
  remark: string,
}

// Home -> Division -> Class -> Student
const isShowHeader = ref(false)
const searchInput = ref('')
const tableData: Ref<TableContent[]> = ref([])
const dpData: Ref<DpContent[]> = ref([])
const currentStudentId = ref()
const filteredTableData = computed(() => tableData.value.filter(data => !searchInput.value ||
    data.studentName.toLowerCase().includes(searchInput.value.toLowerCase()))
)
const handleCurrentChange = (value: TableContent) => {
  if (value.studentName === "../") {
    store.popRoutePath()
    return
  }
  if (!store.route.endsWith("/")) value.studentName = "/" + value.studentName
  store.$patch(state => state.route = store.route + value.studentName + "/")

  if (store.getRouteDepth() == 3) currentStudentId.value = value.studentId
}
watch(() => store.route, (newRoute) => {
  tableData.value = []
  const depth = store.getRouteDepth()
  // console.log("Route changed, newRoute = " + newRoute, "depth = " + depth)

  isShowHeader.value = depth === 2;
  switch (depth) {
    case 0:
      // divisions
      tableData.value = [{"studentName": "Middle School"}, {"studentName": "Junior High"}, {"studentName": "Senior High"}]
      break
    case 1:
      // fetch for classes
      getAllClassesV2().then(d => {
        let data: classDataDisplay[] = d.data.data
        data = data.filter(value => ClassLevelConverter(value.classLevel) === ClassStringLevelConverter(store.getRoutePath(1) as string))
        for (let i = 0; i < data.length; i++) {
          tableData.value.push({"studentName": data[i].className})
        }
      })
      break
    case 2:
      getAllClassStudents(store.getRoutePath(2) as string).then(d => {
        let data: studentDataDisplay[] = d.data.data
        for (let i = 0; i < data.length; i++) {
          tableData.value.push({
            "studentName": data[i].studentName,
            "studentSex": data[i].studentSex,
            "studentAge": data[i].studentAge,
            "studentId": data[i].studentId,
          })
        }
      })
      break
    case 3:
      if (!currentStudentId.value) {
        ElMessage.error("Failed to get Student Id. Please return to root route and retry.")
      }
      getLogsByStudents(currentStudentId.value, store.jwt).then(d => {
        dpData.value = []
        const data = d.data.data
        for (let i = 0; i < data.length; i++) {
          dpData.value.push({
            appeal: AppealConverter(data[i].appeal, '').status,
            date: new Date(data[i].date).toLocaleDateString(),
            dp: data[i].dp,
            logLocation: data[i].logLocation,
            logType: data[i].logType,
            remark: data[i].remark,
          })
        }
      })
  }
  if (depth > 0) {
    tableData.value.unshift({
      "studentName": "../"
    })
  }
}, {immediate: true})

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Backspace") {
    store.popRoutePath()
  }
}
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown)
})
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown)
})
</script>

<template>
  <div>
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item @click="store.$state.route = '/'"><span class="breadcrumb breadcrumb-home">Home</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-show="store.getRouteDepth() >= 1" @click="store.gotoRoute(1)"><span
          class="breadcrumb">{{ store.getRoutePath(1) }}</span></el-breadcrumb-item>
      <el-breadcrumb-item v-show="store.getRouteDepth() >= 2" @click="store.gotoRoute(2)"><span
          class="breadcrumb">{{ store.getRoutePath(2) }}</span></el-breadcrumb-item>
      <el-breadcrumb-item v-show="store.getRouteDepth() >= 3" @click="store.gotoRoute(3)"><span
          class="breadcrumb">{{ store.getRoutePath(3) }}</span></el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
        v-if="store.getRouteDepth() != 3"
        :data="filteredTableData"
        :show-header="isShowHeader"
        highlight-current-row
        style="width: 100%"
        @row-dblclick="handleCurrentChange"
    >
      <el-table-column label="Name" property="studentName"/>
      <el-table-column label="Sex" property="studentSex"/>
      <el-table-column label="Age" property="studentAge"/>
      <el-table-column label="Student ID" property="studentId"/>
      <el-table-column align="right">
        <template #header>
          <el-input v-model="searchInput" placeholder="Type to search" size="small"/>
        </template>
      </el-table-column>
    </el-table>
    <el-table
        v-else
        :data="dpData"
        style="width: 100%"
    >
      <el-table-column label="Date" property="date"/>
      <el-table-column label="Type" property="logType"/>
      <el-table-column label="Location" property="logLocation"/>
      <el-table-column label="DP" property="dp"/>
      <el-table-column label="Appeal" property="appeal"/>
    </el-table>
  </div>
</template>

<style scoped>
.el-breadcrumb {
  margin-top: 4px;
  margin-bottom: calc(4px + 15px); /* 15px is the tab header's margin */
}

.breadcrumb-home {
  font-weight: bold;
}

.breadcrumb {
  color: #ffffff;
}

.breadcrumb:hover {
  color: #409EFF;
  cursor: pointer;
}
</style>