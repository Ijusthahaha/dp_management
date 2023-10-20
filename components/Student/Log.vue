<script setup lang="ts">
import {AppealStatus, DPLog, DPType} from "~/types/DPType";
import {createPendingAppeal, createRawAppeal} from "~/utils/createAppeal";

const appealDialogVisible = ref(false)
let appealItem: DPLog | null = null
const appealReason = ref("")

const {userDP} = useDPDataStore()
userDP.sort((a, b) => {
  return +a.date - +b.date
}).reverse()

const dateFormatter = function (row: DPLog): string {
  const date = new Date(+row.date)
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`
}

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
  // do ajax
  if (appealItem?.appeal) {
    appealItem.appeal = createPendingAppeal(appealItem?.appeal, appealReason.value)
    ElMessage({
      message: "Submitted! Please wait for teacher's process",
      type: 'success',
    })
  }
  appealDialogVisible.value = false
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
</script>

<template>
  <el-empty description="Wow! You currently have 0 dp!" v-if="userDP.length === 0"/>
  <el-table v-else :data="userDP" :default-sort="{ prop: 'date', order: 'descending' }"
            :row-class-name="tableRowClassName">
    <el-table-column prop="date" label="Date" sortable :formatter="dateFormatter"></el-table-column>
    <el-table-column prop="type" label="Type" :formatter="typeFormatter"></el-table-column>
    <el-table-column prop="dp" label="DP" sortable></el-table-column>
    <el-table-column prop="remark" label="Remark"></el-table-column>
    <el-table-column prop="appeal" label="Appeal">
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
        <el-button plain type="primary" size="small" @click="appealOperation(scope)">Appeal</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
      v-model="appealDialogVisible"
      title="Apply appeal"
      width="40%"
      align-center
  >
    <el-table :data="[appealItem]" style="width: 100%">
      <el-table-column prop="date" label="Date" :formatter="dateFormatter"></el-table-column>
      <el-table-column prop="type" label="Type" :formatter="typeFormatter"></el-table-column>
      <el-table-column prop="dp" label="DP"></el-table-column>
      <el-table-column prop="remark" label="Remark"></el-table-column>
    </el-table>

    <el-input
        v-model="appealReason"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        placeholder="Please input your appeal reason."
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

.warning-row, .el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.danger-row, .el-table .danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}
</style>