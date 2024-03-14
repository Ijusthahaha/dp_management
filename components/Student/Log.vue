<script lang="ts" setup>
import {type AppealStatus, type DPLog, DPType} from "~/types/DPType";
import {createPendingAppeal, createRawAppeal} from "~/utils/createAppeal";
import {type Ref} from "@vue/reactivity";
import {AppealConverter} from "~/utils/DPUtils";
import {createAppeals, getAppeals, getRawLogs} from "~/utils/fetch";

const appealDialogVisible = ref(false)
let appealItem: DPLog | null = null
const appealReason = ref("")
const isLoading = ref(true)
const store = useUserStore()
const userDPAppeal: Ref<DPLog[]> = ref([])

const userDP: Ref<DPLog[]> = ref([])
// userDP.sort((a, b) => {
//   return +a.date - +b.date
// }).reverse()

getAppeals(store.jwt).then(data => {
  userDPAppeal.value = data.data.data

  getRawLogs(store.jwt).then(data => {
    const d = ref(data.data.data)
    for (let i = 0; i < d.value.length; i++) {
      d.value[i].appeal = createRawAppeal()
    }

    // bind userDP with userDPAppeal
    for (let i = 0; i < userDPAppeal.value.length; i++) {
      for (let j = 0; j < d.value.length; j++) {
        // @ts-ignore
        if (userDPAppeal.value[i].appeal_id == d.value[j].appealId) {
          // @ts-ignore
          d.value[j].appeal = AppealConverter(userDPAppeal.value[i].appeal_status, userDPAppeal.value[i].appeal_reason)
        }
      }
    }
    userDP.value = d.value
    isLoading.value = false
  });
});

const dateFormatter = function (row: DPLog): string {
  const date = new Date(row.date)
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`
}

/**
 * @Deprecated
 */
const typeFormatter = function (row: DPLog): string {
  return Object.keys(DPType)[Object.values(DPType).indexOf(row.type)]
}

const getStatusType = function (status: any): "success" | "info" | "warning" | "danger" | "" {
  if (status.row.appeal.status == "Not appeal") {
    return 'info'
  }
  if (status.row.appeal.status == "Pending") {
    return 'warning'
  }
  if (status.row.appeal.status == "Fulfilled") {
    return 'success'
  }
  if (status.row.appeal.status == "Rejected") {
    return 'danger'
  }
  return ""
}

const appealOperation = function (scope: any) {
  if (scope.row.appeal.status == "Not appeal") {
    appealDialogVisible.value = true
    appealItem = scope.row
  }
  if (scope.row.appeal.status == "Pending") {
    ElMessage({
      message: 'You already submitted an appeal.',
      type: 'warning',
    })
  }
  if (scope.row.appeal.status == "Fulfilled") {
    ElMessage({
      message: 'Your appeal already fulfilled.',
      type: 'success',
    })
  }
  if (scope.row.appeal.status == "Rejected") {
    ElMessage({
      message: 'Teacher already rejected your appeal.',
      type: 'error',
    })
  }
}

const submitAppeal = function () {
  if (appealItem?.appeal) {
    if (!appealReason.value) {
      ElMessage({
        message: "Reason is required.",
        type: 'error',
      })
    } else {
      // @ts-ignore
      createAppeals(appealItem.logId, appealItem.appealId, appealReason.value, store.jwt).then(() => {
        // @ts-ignore
        appealItem!.appeal = createPendingAppeal(appealItem?.appeal, appealReason.value)
        ElMessage({
          message: "Submitted! Please wait for teacher's process.",
          type: 'success',
        })
        appealDialogVisible.value = false
      })
    }
  }
}

const tableRowClassName = function ({row, rowIndex}: { row: DPLog, rowIndex: number }) {
  if (row.dp >= 3 && row.dp < 6) {
    return "warning-row"
  }
  if (row.dp >= 6) {
    return "danger-row"
  }
  return ""
}

let currentPage = ref(1)
let pageSize = ref(7)

const handleSizeChange = (val: number) => {
  currentPage.value = 1;
  pageSize.value = val;
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
}
</script>

<template>
  <el-empty v-if="userDP.length === 0 && isLoading === false" description="Wow! You currently have 0 dp!"/>

  <el-table v-else v-loading="isLoading" :data="userDP.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            :default-sort="{ prop: 'date', order: 'descending' }" :row-class-name="tableRowClassName">
    <el-table-column :formatter="dateFormatter" label="Date" prop="date" sortable></el-table-column>
    <el-table-column label="Type" prop="logType"></el-table-column>
    <el-table-column label="DP" prop="dp" sortable></el-table-column>
    <!--    <el-table-column prop="remark" label="Remark"></el-table-column>-->
    <el-table-column label="Location" prop="logLocation"></el-table-column>
    <el-table-column label="Appeal" prop="appeal">
      <template #default="scope">
        <el-popover trigger="hover" width="auto">
          <template #default>
            <div>Status: {{ scope.row.appeal.status }}</div>
            <div v-if="scope.row.appeal.status == AppealStatus.NOT_APPEAL"></div>
            <div v-else-if="scope.row.appeal.status == AppealStatus.PENDING">Waiting for teacher's process</div>
            <div v-else-if="scope.row.appeal.status == AppealStatus.REJECTED">
              <span>Teacher rejected your appeal.</span><br>
              <span>Reason: {{ scope.row.appeal.reason }}</span>
            </div>
            <div v-else-if="scope.row.appeal.status == AppealStatus.FULFILLED">Your appeal passed.</div>
          </template>
          <template #reference>
            <el-tag :type="getStatusType(scope)">{{ scope.row.appeal.status }}</el-tag>
          </template>
        </el-popover>
      </template>
    </el-table-column>

    <el-table-column label="Operation">
      <template #default="scope">
        <el-button plain size="small" type="primary" @click="appealOperation(scope)">Appeal</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination background
                 layout="prev, pager, next"
                 :current-page="currentPage"
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 hide-on-single-page
                 :teleported="false"
                 :total="userDP.length"
                 class="page"
  />

  <el-dialog
      v-model="appealDialogVisible"
      align-center
      title="Apply appeal"
      width="40%"
  >
    <el-table :data="[appealItem]" style="width: 100%">
      <el-table-column :formatter="dateFormatter" label="Date" prop="date"></el-table-column>
      <el-table-column label="Type" prop="logType"></el-table-column>
      <el-table-column label="DP" prop="dp"></el-table-column>
      <el-table-column label="Remark" prop="remark"></el-table-column>
    </el-table>

    <el-input
        v-model="appealReason"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="Please input your appeal reason."
        type="textarea"
    />

    <el-text type="danger">You can only apply this appeal once.</el-text>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="appealDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitAppeal">
          Submit
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style>
.el-table {
  height: 100%;
  width: 100%;
}

.page {
  justify-content: center;
  transform: translateY(-50px);
}

.warning-row, .el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.danger-row, .el-table .danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}
</style>