<script setup lang="ts">
import {AppealStatus, DPLog, DPType} from "~/types/DPType";
import {useMessageStore} from "~/composables/messageStore";
import {createPendingAppeal, fulfillAppeal} from "~/utils/createAppeal";
import {storeToRefs} from "pinia";

const store = useMessageStore()
const {messages} = storeToRefs(store)

let appealItem: DPLog | undefined;
const currentIndex = ref(0)

const fulfillDialog = ref(false)
const rejectDialog = ref(false)
const appealReason = ref("")
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

const appealFulfillOperation = function (scope: any) {
  fulfillDialog.value = true
  appealItem = scope.row
  currentIndex.value = scope.$index
}

const appealRejectOperation = function (scope: any) {
  rejectDialog.value = true
  appealItem = scope.row
  currentIndex.value = scope.$index
}

const submitOperation = function (type: string) {
  if (type == "fulfill") {
    // do ajax (change the status)
    store.deleteMessage(currentIndex.value)
    fulfillDialog.value = false
  } else if (type == "reject") {
    // do ajax (change the status)
    if (appealReason.value) {
      store.deleteMessage(currentIndex.value)
      rejectDialog.value = false
    }
    else {
      ElMessage({
        type: 'error',
        message: 'Reasons are required.'
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
</script>

<template>

  <el-empty description="You don't have any appeal to process." v-if="messages.length === 0"/>
  <el-table v-else :data="messages" :default-sort="{ prop: 'date', order: 'descending' }"
            :row-class-name="tableRowClassName">
    <el-table-column prop="date" label="Date" sortable :formatter="dateFormatter"></el-table-column>
    <el-table-column prop="name" label="Name"></el-table-column>
    <el-table-column prop="clazz" label="Class"></el-table-column>
    <el-table-column prop="type" label="Type" :formatter="typeFormatter"></el-table-column>
    <el-table-column prop="dp" label="DP" sortable></el-table-column>
    <el-table-column prop="remark" label="Remark"></el-table-column>
    <el-table-column prop="appeal.reason" label="Appeal Reason"></el-table-column>

    <el-table-column label="Operation">
      <template #default="scope">
        <div class="dialogTrigger">
          <el-button plain type="primary" size="small" @click="appealFulfillOperation(scope)">Fulfill</el-button>
          <el-button plain type="danger" size="small" @click="appealRejectOperation(scope)">Reject</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
      v-model="fulfillDialog"
      title="Fulfill appeal"
      width="70%"
      align-center
  >
    <el-table :data="[appealItem]" style="width: 100%">
      <el-table-column prop="date" label="Date" :formatter="dateFormatter"></el-table-column>
      <el-table-column prop="type" label="Type" :formatter="typeFormatter"></el-table-column>
      <el-table-column prop="dp" label="DP"></el-table-column>
      <el-table-column prop="remark" label="Remark"></el-table-column>
      <el-table-column prop="appeal.reason" label="Appeal Reason"></el-table-column>
    </el-table>

    <!--    we don't need a reason for fulfill the appeal.-->
    <!--    <el-input-->
    <!--        v-model="appealReason"-->
    <!--        :autosize="{ minRows: 2, maxRows: 4 }"-->
    <!--        type="textarea"-->
    <!--        placeholder="Please input your appeal reason."-->
    <!--    />-->

    <el-text type="danger">You are not able to cancel this appeal after submitted.</el-text>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="fulfillDialog = false">Cancel</el-button>
        <el-button type="primary" @click="submitOperation('fulfill')">
          Fulfill!
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
      v-model="rejectDialog"
      title="Reject appeal"
      width="70%"
      align-center
  >
    <el-table :data="[appealItem]" style="width: 100%">
      <el-table-column prop="date" label="Date" :formatter="dateFormatter"></el-table-column>
      <el-table-column prop="type" label="Type" :formatter="typeFormatter"></el-table-column>
      <el-table-column prop="dp" label="DP"></el-table-column>
      <el-table-column prop="remark" label="Remark"></el-table-column>
      <el-table-column prop="appeal.reason" label="Appeal Reason"></el-table-column>
    </el-table>

    <el-input
        v-model="appealReason"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        placeholder="Please input the reason."
    />

    <el-text type="danger">You are not able to cancel this appeal after submitted.</el-text>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="rejectDialog = false">Cancel</el-button>
        <el-button type="primary" @click="submitOperation('reject')">
          Submit
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialogTrigger {
  display: flex;
}
</style>

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