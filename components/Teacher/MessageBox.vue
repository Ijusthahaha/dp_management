<script lang="ts" setup>
import {DPLog, DPType, MessageLog} from "~/types/DPType";
import {useMessageStore} from "~/composables/messageStore";
import {storeToRefs} from "pinia";
import {fulfillAppeals, getPendingAppeals, rejectAppeals} from "~/utils/fetch";

const store = useMessageStore()
const {messages} = storeToRefs(store)
const userStore = useUserStore()

const isLoading = ref(true)

let appealItem: DPLog | undefined;
const currentIndex = ref(0)

const fulfillDialog = ref(false)
const rejectDialog = ref(false)
const appealReason = ref("")
const dateFormatter = function (row: DPLog): string {
  const date = new Date(row.date)
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
    // @ts-ignore
    fulfillAppeals(userStore.jwt, appealItem!.id).then(() => {
      store.deleteMessage(currentIndex.value)
      fulfillDialog.value = false
    })
  } else if (type == "reject") {
    if (appealReason.value) {
      // @ts-ignore
      rejectAppeals(userStore.jwt, appealItem!.id, appealReason.value).then(() => {
        store.deleteMessage(currentIndex.value)
        rejectDialog.value = false
      })
    } else {
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

getPendingAppeals(userStore.jwt).then((data) => {
  store.$patch(state => {
    let d: MessageLog[] = data.data.data
    for (let i = 0; i < d.length; i++) {
      d[i].date = new Date(d[i].date).toString()
    }
    state.messages = d
  })
  isLoading.value = false
})
</script>

<template>

  <el-empty v-if="messages.length === 0 && isLoading === false" description="You don't have any appeal to process."/>
  <el-table v-else v-loading="isLoading" :data="messages" :default-sort="{ prop: 'date', order: 'descending' }"
            :row-class-name="tableRowClassName">
    <el-table-column :formatter="dateFormatter" label="Date" prop="date" sortable></el-table-column>
    <el-table-column label="Name" prop="studentName"></el-table-column>
    <el-table-column label="Class" prop="studentClass"></el-table-column>
    <el-table-column label="Type" prop="type"></el-table-column>
    <el-table-column label="DP" prop="dp" sortable></el-table-column>
    <!--    <el-table-column label="Remark" prop="remark"></el-table-column>-->
    <el-table-column label="Appeal Reason" prop="reason"></el-table-column>

    <el-table-column label="Operation">
      <template #default="scope">
        <div class="dialogTrigger">
          <el-button plain size="small" type="primary" @click="appealFulfillOperation(scope)">Fulfill</el-button>
          <el-button plain size="small" type="danger" @click="appealRejectOperation(scope)">Reject</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
      v-model="fulfillDialog"
      align-center
      title="Fulfill appeal"
      width="70%"
  >
    <el-table :data="[appealItem]" style="width: 100%">
      <el-table-column :formatter="dateFormatter" label="Date" prop="date"></el-table-column>
      <el-table-column :formatter="typeFormatter" label="Type" prop="type"></el-table-column>
      <el-table-column label="DP" prop="dp"></el-table-column>
      <el-table-column label="Remark" prop="remark"></el-table-column>
      <el-table-column label="Appeal Reason" prop="reason"></el-table-column>
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
      align-center
      title="Reject appeal"
      width="70%"
  >
    <el-table :data="[appealItem]" style="width: 100%">
      <el-table-column :formatter="dateFormatter" label="Date" prop="date"></el-table-column>
      <el-table-column :formatter="typeFormatter" label="Type" prop="type"></el-table-column>
      <el-table-column label="DP" prop="dp"></el-table-column>
      <el-table-column label="Remark" prop="remark"></el-table-column>
      <el-table-column label="Appeal Reason" prop="reason"></el-table-column>
    </el-table>

    <el-input
        v-model="appealReason"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="Please input the reason."
        type="textarea"
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