<script lang="ts" setup>
import {
  deleteTeacher,
  exportTeacherTable,
  getAllClasses,
  getAllTeachers,
  insertTeacher,
  modifyTeacher
} from "~/utils/fetch";
import {
  type modifyTeacherType,
  type teacherDataDisplay,
  type tinyTeacherDataDisplay,
  type unConvertedTeacherData
} from "~/types/dataDisplay";
import {Delete, Download, Edit, Upload, UploadFilled} from "@element-plus/icons-vue";
import {useStudentStore} from "~/composables/studentStore";
import type {Ref} from "@vue/reactivity";
import {TeacherLevelConverterForEntire, TeacherLevelToNumberConverter} from "~/utils/DPUtils";
import {storeToRefs} from "pinia";
import {type UploadRawFile} from "element-plus";
import {TeacherType} from "~/types/User";

const currentRow: Ref<teacherDataDisplay | undefined> = ref()

const store = useUserStore()
const studentStore = useStudentStore()
const {allClasses} = storeToRefs(studentStore)

let isTableDataLoading = ref(true)
const addTeacherDialogVisible = ref(false)
const modifyTeacherDialogVisible = ref(false)
const deleteTeacherDialogVisible = ref(false)

const selectedAutocompleteItem = ref('')
const tableColumns = ref([
  {key: "id", dataKey: "teacherUuid", title: "UUID", width: 100},
  {key: "name", dataKey: "teacherName", title: "Teacher Name", width: 300},
  {key: "level", dataKey: "teacherLevel", title: "Teacher Level", width: 200},
  {key: "class", dataKey: "teacherClass", title: "Associated Class", width: 300},
  {key: "search", dataKey: "search", title: "Search"}
])

const refreshTeachers = () => {
  isTableDataLoading.value = true
  getAllTeachers(store.jwt).then(d => {
    const data: unConvertedTeacherData[] = d.data.data
    studentStore.$patch(state => {
      state.allTeachers = TeacherLevelConverterForEntire(data)
    })
    currentRow.value = undefined
    selectedAutocompleteItem.value = ''
    isTableDataLoading.value = false
  })
}

onMounted(() => {
  if (studentStore.allClasses === undefined) {
    getAllClasses().then(d => {
      let data = d.data.data

      // students may not have a class.
      data.push("")

      studentStore.$patch(state => {
        state.allClasses = data
      })
    })
  }

  if (studentStore.allTeachers.length === 0) {
    refreshTeachers()
  } else {
    isTableDataLoading.value = false
  }
})

const getClassList = () => allClasses.value?.filter(data => data !== "")

const filterTableData = computed(() =>
    studentStore.allTeachers?.filter(data =>
        !selectedAutocompleteItem.value || data.teacherName.toLowerCase().includes(selectedAutocompleteItem.value.toLowerCase())
    )
)

const handleRowClick = function (event: MouseEvent) {
  const targetNode = event.target as HTMLElement
  const parentNode = targetNode.parentNode as HTMLElement

  // crazy
  if (parentNode.className === "el-table-v2__row") {
    const array = []
    for (let i of parentNode.children) {
      const content = i.textContent
      array.push(content)
    }
    currentRow.value = {
      teacherClass: array[3] as string,
      teacherId: 0,
      teacherLevel: array[2] as TeacherType,
      teacherName: array[1] as string,
      teacherUuid: array[0] as unknown as number
    }
  }
}

let addTeacherForm = reactive<tinyTeacherDataDisplay>({
  teacherUuid: 0,
  teacherName: '',
  teacherClass: '',
  teacherLevel: TeacherType.Default
})

const handleClose = (done: Function) => {
  ElMessageBox.confirm('Do you want to exit?')
      .then(() => {
        addTeacherForm.teacherUuid = 0
        addTeacherForm.teacherName = ''
        addTeacherForm.teacherClass = ''
        addTeacherForm.teacherLevel = TeacherType.Default
        done()
      })
      .catch(() => {
      })
}

const toggleAddTeacherForm = () => {
  if (addTeacherForm.teacherName.trim() !== "") {
    insertTeacher(store.jwt, {
      ...addTeacherForm,
      teacherLevel: TeacherLevelToNumberConverter(addTeacherForm.teacherLevel),
      modifyTeacherPassword: false
    }).then(() => {
      addTeacherDialogVisible.value = false
      ElMessage.success('Successfully done.')
    }).catch(e => {
      ElMessage.error('Unexpected error occurred.')
      console.error(e)
    })
  } else {
    ElMessage.error("Fields are required.")
  }
}

const exportTable = () => {
  exportTeacherTable(store.jwt).then(res => {
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', "Teacher Excel.xlsx")
    document.body.appendChild(link)
    link.click()

    ElMessage.success('Ready.')
  }).catch(() => {
    ElMessage.error('Unexpected error occurred.')
  })
}

const beforeUploadTable = (file: UploadRawFile) => {
  if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      file.type !== "application/vnd.ms-excel") {
    ElMessage.error('File type not allowed.')
    return false
  }
  if (file.size / 1024 / 1024 > 1) {
    ElMessage.error('File size too large.')
    return false
  }
  return true
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

const modifyTeachers = reactive<tinyTeacherDataDisplay>({
  teacherUuid: 0,
  teacherName: '',
  teacherClass: '',
  teacherLevel: TeacherType.Default
})
const modifySettings: Ref<string[]> = ref([])
const submitModifyTeacher = () => {
  if (!modifyTeachers.teacherLevel) {
    ElMessage.error("Teacher level is required.")
  }

  const submitForm: modifyTeacherType = {
    ...modifyTeachers,
    modifyTeacherPassword: false,
  }
  submitForm.modifyTeacherPassword = modifySettings.value.includes("Teacher Password")

  modifyTeacher(store.jwt, {
    ...submitForm,
    teacherLevel: TeacherLevelToNumberConverter(submitForm.teacherLevel)
  }).then(() => {
    modifyTeacherDialogVisible.value = false
    ElMessage.success('Done.')
    selectedAutocompleteItem.value = ''

    refreshTeachers()
  }).catch(() => {
    ElMessage.error('Unexpected error occurred.')
  })
}

const submitDeleteTeacher = () => {
  if (currentRow.value) {
    deleteTeacher(store.jwt, currentRow.value.teacherUuid).then(() => {
      ElMessage.success('Done.')
    }).catch(() => {
      ElMessage.error('Unexpected error occurred.')
    })
  }
  refreshTeachers()
  deleteTeacherDialogVisible.value = false
}

watch(currentRow, v => {
  if (!v) return
  modifyTeachers.teacherUuid = v.teacherUuid
  modifyTeachers.teacherName = v.teacherName
  modifyTeachers.teacherClass = v.teacherClass
  modifyTeachers.teacherLevel = v.teacherLevel
})
</script>

<template>
  <div class="container">
    <el-row style="margin: 8px 0 8px 0">
      <el-button plain type="primary" @click="addTeacherDialogVisible = true">Add Teachers</el-button>
      <el-button :icon="Upload" bg text type="info" @click="importDialogVisible = true">Import</el-button>
      <el-button :icon="Download" bg text type="info" @click="exportTable">Export</el-button>

      <template v-if="currentRow">
        <el-button :icon="Edit" type="primary" @click="modifyTeacherDialogVisible = true">Modify Teacher
          "{{ currentRow.teacherName }}"
        </el-button>
        <el-button :icon="Delete" type="danger" @click="deleteTeacherDialogVisible = true">Delete Teacher
          "{{ currentRow.teacherName }}"
        </el-button>
      </template>
    </el-row>
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2 v-loading="isTableDataLoading" :columns="tableColumns"
                     :data="filterTableData"
                     :height="height" :width="width"
                     style="width: 100%"
                     @click="handleRowClick($event)">
          <!--spent 3 hours on this el-input box-->
          <template #header-cell="{ column, columnIndex }">
            <template v-if="columnIndex === tableColumns.length - 1">
              <el-input v-model="selectedAutocompleteItem" placeholder="Type to Search"/>
            </template>
            <template v-else>
              {{ column.title }}
            </template>
          </template>
        </el-table-v2>
      </template>
    </el-auto-resizer>
    <el-drawer
        ref="drawerRef"
        v-model="addTeacherDialogVisible"
        :before-close="handleClose"
        direction="ltr"
        title="Add Teacher Form"
    >
      <div>
        <el-form :model="addTeacherForm">
          <el-form-item label="Teacher Name" required>
            <el-input v-model="addTeacherForm.teacherName" autocomplete="disable" placeholder="Teacher's name"/>
          </el-form-item>
          <el-form-item label="Teacher Class">
            <el-select v-model="addTeacherForm.teacherClass" placeholder="Select">
              <el-option
                  v-for="(item, i) in getClassList()"
                  :key="i"
                  :label="item"
                  :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Teacher Level" required>
            <el-select v-model="addTeacherForm.teacherLevel" placeholder="Select">
              <el-option
                  v-for="(item, i) in TeacherType"
                  :key="i"
                  :label="item"
                  :value="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div>
          <el-button @click="toggleAddTeacherForm">Add Teacher</el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog
        v-model="importDialogVisible"
        :closable="false"
        align-center
        title="Import teachers from Excel"
        width="800"
    >
      <el-alert description='Teacher Level: Default => 0, CT => 1, Director => 2, Admin => 3' show-icon
                style="margin-bottom: 5px"
                title="Notice"
                type="info"/>
      <el-upload ref="upload"
                 :before-upload="beforeUploadTable"
                 :headers="{token: store.jwt}"
                 :limit="1"
                 :on-error="onUploadTableError"
                 :on-success="onUploadTableSuccess"
                 :show-file-list="false"
                 accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                 action="/api/uploadTeacherExcel"
                 drag>
        <el-icon class="el-icon--upload">
          <UploadFilled/>
        </el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            <el-link href="/Teacher Excel Template.xlsx" type="primary">Click here</el-link>
            to download template.
          </div>
        </template>
      </el-upload>
    </el-dialog>
    <el-dialog
        v-model="modifyTeacherDialogVisible"
        align-center
        destroy-on-close
        title="Edit teacher"
        width="700"
    >
      <el-form :model="modifyTeachers">
        <el-form-item label="Teacher name">
          <el-input v-model="modifyTeachers.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="Teacher Class">
          <el-select v-model="modifyTeachers.teacherClass" placeholder="Select">
            <el-option
                v-for="(item, i) in getClassList()"
                :key="i"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Teacher Level">
          <el-select v-model="modifyTeachers.teacherLevel" placeholder="Select">
            <el-option
                v-for="(item, i) in TeacherType"
                :key="i"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-text class="assignOrResetText" type="info">Assign or reset:</el-text>
      <el-checkbox-group v-model="modifySettings">
        <el-checkbox border label="Teacher Password" value="password"/>
      </el-checkbox-group>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="modifyTeacherDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitModifyTeacher">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
        v-model="deleteTeacherDialogVisible"
        align-center
        title="Warning"
        width="500"
    >
      <span>Are you sure you want to delete teacher "{{ currentRow?.teacherName }}" ?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteTeacherDialogVisible = false">Cancel</el-button>
          <el-button type="danger" @click="submitDeleteTeacher">
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

.assignOrResetText {
  color: var(--el-text-color-regular);
  font-size: 18px;
  margin: 24px 0;
  display: block;
}
</style>