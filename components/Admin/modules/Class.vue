<script lang="ts" setup>
import {createClass, deleteClass, getClassData, importClassTable} from "~/utils/fetch";
import {ElTable} from "#components";
import {type classDataDisplay, type tinyClassDataDisplay} from "~/types/dataDisplay";
import {Coordinate, Edit, Upload, UploadFilled, UserFilled} from "@element-plus/icons-vue";
import {useStudentStore} from "~/composables/studentStore";
import type {Ref} from "@vue/reactivity";
import {ClassLevelConverter} from "~/utils/DPUtils";
import type {UploadRequestOptions} from "element-plus";
import {beforeUploadTable} from "~/utils/tableUtils";

const currentRow: Ref<classDataDisplay | undefined> = ref()

const store = useUserStore()
const studentStore = useStudentStore()

let isTableDataLoading = ref(true)
const createClassDialogVisible = ref(false)
const disbandClassDialogVisible = ref(false)

onMounted(() => {
  if (studentStore.allClasses) {
    isTableDataLoading.value = false
    return
  }
  refresh()
})

const handleCurrentChange = (val: classDataDisplay) => {
  currentRow.value = val
}

const getClassList = () => studentStore?.allClasses?.filter(data => data.classId !== -1)

interface expandedChildType {
  student_count: number,
  total_dp: number
}

let isExpandedChildLoading = ref(false)
let classDataList: Ref<{
  classId: number,
  data: expandedChildType
}[]> = ref([])

const getClassDataListStudentCount = (classId: number) => {
  const data = classDataList.value.find(value => value.classId === classId)
  return data ? data.data.student_count : 0
}
const getClassDataListTotalDp = (classId: number) => {
  const data = classDataList.value.find(value => value.classId === classId)
  return data ? data.data.total_dp : 0
}
const onExpandChanged = (row: classDataDisplay, expanded: any[]) => {
  if (expanded.length === 0) return
  for (let i = 0; i < classDataList.value.length; i++) {
    if (row.classId === classDataList.value[i].classId) return
  }

  isExpandedChildLoading.value = true
  getClassData(row.classId).then(d => {
    const data: expandedChildType = d.data.data
    classDataList.value.push({
      classId: row.classId,
      data: {
        student_count: data.student_count,
        total_dp: data.total_dp
      }
    })
    isExpandedChildLoading.value = false
  })
}

const classLevelFormatter = (row: classDataDisplay) => {
  return ClassLevelConverter(row.classLevel)
}

const selectedAutocompleteItem = ref('')
const filterTableData = computed(() => {
      const c = studentStore.allClasses?.filter(d => d.classId !== -1)
      if (!c) return []
      if (!selectedAutocompleteItem.value || selectedAutocompleteItem.value == '') {
        return c
      } else {
        return c.filter(
            (data) => data.className.toLowerCase().includes(selectedAutocompleteItem.value.toLowerCase())
        )
      }
    }
)

let createClassForm = reactive<tinyClassDataDisplay>({
  className: '',
  classLevel: -1
})

const refresh = () => {
  isTableDataLoading.value = true
  getAllClassesV2().then(d => {
    let data: classDataDisplay[] = d.data.data
    // students may not have a class.
    data.push({classId: -1, classLevel: -1, className: ""})

    studentStore.$patch(state => {
      state.allClasses = data
    })
    isTableDataLoading.value = false
  })
}

const toggleCreateClassForm = () => {
  if (createClassForm.className !== '') {
    createClass(store.jwt, createClassForm).then(() => {
      createClassDialogVisible.value = false
      refresh()
      ElMessage.success('Successfully done.')
    }).catch(e => {
      ElMessage.error('Unexpected error occurred.')
      console.error(e)
    })
  }
}

const importDialogVisible = ref(false)
const upload: Ref<{ clearFiles: Function } | null> = ref(null)
const onUploadTableSuccess = () => {
  if (upload.value) {
    upload.value.clearFiles()
  }
  importDialogVisible.value = false
  ElMessage.success('Upload done.')
}
const onUploadTableError = () => {
  ElMessage.error('Unexpected error occurred.')
}

const uploadClassExcel = (param: UploadRequestOptions) => {
  importClassTable(store.jwt, param, currentImportClassSelected.value).then(() => {
    onUploadTableSuccess()
  })
}

const submitDisbandClass = () => {
  deleteClass(store.jwt, currentRow.value?.classId as number).then(() => {
    ElMessage.success("Disband Class Done.")
    refresh()
    disbandClassDialogVisible.value = false
  })
}

const currentActiveStep = ref(1)
const currentImportClassSelected = ref('')
</script>

<template>
  <div class="container">
    <el-row style="margin: 8px 0 8px 0">
      <el-button plain type="primary" @click="createClassDialogVisible = true">Create Empty Class</el-button>
      <el-button :icon="Upload" bg text type="info" @click="currentActiveStep = 1; importDialogVisible = true">Import
        Students as Class
      </el-button>
      <el-button v-if="currentRow" :icon="Edit" plain type="danger"
                 @click="onExpandChanged(currentRow, [{}, {}]); disbandClassDialogVisible = true">Disband
        Class
        "{{ currentRow.className }}"
      </el-button>
    </el-row>
    <el-table v-loading="isTableDataLoading" :data="filterTableData"
              :default-sort="{ prop: 'classLevel', order: 'ascending' }" height="100%"
              highlight-current-row
              style="width: 100%" @current-change="handleCurrentChange" @expand-change="onExpandChanged">
      <el-table-column type="expand">
        <template #default="props">
          <el-descriptions
              v-loading="isExpandedChildLoading"
              :column="2"
              border
              title="Class details"
          >
            <el-descriptions-item width="150px">
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Coordinate/>
                  </el-icon>
                  Students Count
                </div>
              </template>
              {{ getClassDataListStudentCount(props.row.classId) }}
            </el-descriptions-item>
            <el-descriptions-item width="150px">
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <UserFilled/>
                  </el-icon>
                  Total DP Obtained
                </div>
              </template>
              {{ getClassDataListTotalDp(props.row.classId) }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column :formatter="classLevelFormatter" label="Class Level" prop="classLevel"/>
      <el-table-column label="Class" prop="className"/>
      <el-table-column align="right">
        <template #header>
          <el-input v-model="selectedAutocompleteItem" placeholder="Type to search in each page" size="small"/>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        v-model="createClassDialogVisible"
        align-center
        title="Create Empty Class"
        width="500"
    >
      <el-form :model="createClassForm" label-width="auto">
        <el-form-item label="Class name" required>
          <el-input v-model="createClassForm.className" placeholder="Example: Morandi"/>
        </el-form-item>
        <el-form-item label="Class Level" required>
          <el-select v-model="createClassForm.classLevel" placeholder="Select">
            <el-option
                v-for="item in [-1, 0, 1, 2]"
                :key="item"
                :label="ClassLevelConverter(item)"
                :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="createClassDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="toggleCreateClassForm">
            Submit
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
        v-model="importDialogVisible"
        :closable="false"
        align-center
        destroy-on-close
        title="Import students from Excel"
        width="800"
    >
      <el-steps :active="currentActiveStep" align-center>
        <el-step title="Select class"/>
        <el-step title="Import excel"/>
      </el-steps>
      <div class="steps">
        <div v-if="currentActiveStep === 1" class="selectClassStep">
          <p style="margin-right: 12px">Select class:</p>
          <el-select v-model="currentImportClassSelected" placeholder="Select">
            <el-option
                v-for="(item, i) in getClassList()"
                :key="i"
                :label="item.className"
                :value="item.className"
            />
          </el-select>
          <el-button style="margin-left: 12px" @click="currentActiveStep = 2">Next Step</el-button>
        </div>
        <div v-if="currentActiveStep === 2">
          <el-alert
              :closable="false"
              description="You can use Student Excel Template, but the class field will not be read."
              show-icon
              style="margin-bottom: 5px"
              title="Notice: "
              type="info"
          />
          <el-upload
              ref="upload"
              :before-upload="beforeUploadTable"
              :headers="{token: store.jwt}"
              :http-request="uploadClassExcel"
              :limit="1"
              :on-error="onUploadTableError"
              :on-success="onUploadTableSuccess"
              :show-file-list="false"
              accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              action=""
              drag>
            <el-icon class="el-icon--upload">
              <UploadFilled/>
            </el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                <el-link href="/excels/Class Excel Template.xlsx" type="primary">Click here</el-link>
                to download template.
              </div>
            </template>
          </el-upload>
        </div>
      </div>
    </el-dialog>
    <el-dialog
        v-model="disbandClassDialogVisible"
        align-center
        destroy-on-close
        title="Disband Class"
        width="700"
    >
      <el-alert
          :closable="false"
          :description="`Class Level: ${ClassLevelConverter(currentRow?.classLevel as number)}`"
          :title='`Disband Class "${currentRow?.className}" ?`'
          show-icon
          type="info"
      />
      <el-descriptions
          v-loading="isExpandedChildLoading"
          :column="2"
          border
          style="margin-top: 10px"
      >
        <el-descriptions-item width="150px">
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Coordinate/>
              </el-icon>
              Students Count
            </div>
          </template>
          {{ getClassDataListStudentCount(currentRow?.classId as number) }}
        </el-descriptions-item>
        <el-descriptions-item width="150px">
          <template #label>
            <div class="cell-item">
              <el-icon>
                <UserFilled/>
              </el-icon>
              Total DP Obtained
            </div>
          </template>
          {{ getClassDataListTotalDp(currentRow?.classId as number) }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="disbandClassDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitDisbandClass">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.steps {
  margin-top: 20px;
}

.selectClassStep {
  font-size: 18px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>