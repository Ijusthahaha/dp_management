<script lang="ts" setup>
import type {operationType} from "~/types/dataDisplay";
import type {Ref} from "@vue/reactivity";
import type {TableColumnCtx} from "element-plus";
import {getOperation} from "~/utils/fetch";

const store = useUserStore()
const dateShortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const tableData: Ref<operationType[]> = ref([])
const dateFormatter = (row: operationType, column: TableColumnCtx<operationType>) => {
  const date = Date.parse(row.createTime)
  const o = new Date()
  o.setTime(date)
  return o.toLocaleString();
}
const userIdFormatter = (row: operationType, column: TableColumnCtx<operationType>) => {
  return !row.userId ? "Null" : row.userId
}

const detailDialogVisible = ref(false)
const detailRef: Ref<operationType | undefined> = ref()
const handleClick = (row: operationType) => {
  detailDialogVisible.value = true
  detailRef.value = row
}

const selectTimeForm = ref('')
const onSelectTimeFormSubmit = () => {
  let query = ""
  if (selectTimeForm.value[0]) query += "startTime=" + selectTimeForm.value[0]
  if (selectTimeForm.value[0] && selectTimeForm.value[1]) query += "&"
  if (selectTimeForm.value[1]) query += "endTime=" + selectTimeForm.value[1]
  getOperation(store.jwt, query).then(d => {
    tableData.value = d.data.data
  })
}
</script>

<template>
  <div class="container">
    <div class="selectTime">
      <el-date-picker
          v-model="selectTimeForm"
          :shortcuts="dateShortcuts"
          end-placeholder="End time"
          range-separator="To"
          start-placeholder="Start time"
          type="daterange"
          value-format="x"
      />
      <el-button style="margin-left: 16px" type="primary" @click="onSelectTimeFormSubmit">Query</el-button>
    </div>
    <el-table :data="tableData" :default-sort="{ prop: 'date', order: 'descending' }" stripe style="width: 100%">
      <el-table-column :formatter="dateFormatter" fixed label="Date" prop="createTime"/>
      <el-table-column label="Module" prop="module"/>
      <el-table-column label="Type" prop="type"/>
      <el-table-column :formatter="userIdFormatter" label="User ID" prop="userId"/>
      <el-table-column label="URI" prop="uri"/>
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-button link size="small" type="primary" @click="handleClick(scope.row)">
            Detail
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        v-model="detailDialogVisible"
        align-center
        title="Detail"
    >
      <el-descriptions :column="1" direction="horizontal" size="large">
        <el-descriptions-item label="Description"><span class="font16px">{{ detailRef?.description }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="Method"><span class="font16px">{{ detailRef?.method }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="Request Param"><span class="font16px">{{ detailRef?.requestParam }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="Response Param"><span class="font16px">{{ detailRef?.responseParam }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<style scoped>
.selectTime {
  display: inline-block;
  margin-bottom: 16px;
}

.font16px {
  font-size: 16px;
}
</style>