<script lang="ts" setup>
import {exportStudentTable, getAllClasses, getAllClassStudents, insertStudent, modifyStudent} from "~/utils/fetch";
import {ElTable} from "#components";
import {type modifyStudentType, type studentDataDisplay, type tinyStudentDataDisplay} from "~/types/dataDisplay";
import {
  Coordinate,
  Download,
  Edit,
  HomeFilled,
  Male,
  Tickets,
  Upload,
  UploadFilled,
  UserFilled
} from "@element-plus/icons-vue";
import {useStudentStore} from "~/composables/studentStore";
import type {Ref} from "@vue/reactivity";
import {ClassLevelConverterForEntire} from "~/utils/DPUtils";
import {storeToRefs} from "pinia";
import type {UploadRawFile} from "element-plus";

const singleTableRef = ref<InstanceType<typeof ElTable>>()
const currentRow: Ref<studentDataDisplay | undefined> = ref()

const store = useUserStore()
const studentStore = useStudentStore()
const {allClasses} = storeToRefs(studentStore)

let currentPage = ref(1)
let isTableDataLoading = ref(true)
let classStudentData: Ref<studentDataDisplay[]> = ref([])
const addStudentDialogVisible = ref(false)
const modifyStudentDialogVisible = ref(false)

onMounted(() => {
  getAllClasses().then(d => {
    let data = d.data.data

    // students may not have a class.
    data.push("")

    studentStore.$patch(state => {
      state.allClasses = data
    })

    getAllClassStudents(data[0]).then(d => {
      classStudentData.value = ClassLevelConverterForEntire(d.data.data)
      currentPage.value = 1
      isTableDataLoading.value = false
    })
  })
})

const handlePaginationChange = (val: number) => {
  isTableDataLoading.value = true
  const currentClass = ((studentStore.allClasses) as string[])[val - 1]
  getAllClassStudents(currentClass).then(d => {
    classStudentData.value = ClassLevelConverterForEntire(d.data.data)
    currentPage.value = val
    isTableDataLoading.value = false
  })
}

const handleCurrentChange = (val: studentDataDisplay) => {
  currentRow.value = val
}

const selectedAutocompleteItem = ref('')
const filterTableData = computed(() => {
      if (!selectedAutocompleteItem.value || selectedAutocompleteItem.value == '') {
        return classStudentData.value
      } else {
        return classStudentData.value.filter(
            (data) => data.studentName.toLowerCase().includes(selectedAutocompleteItem.value.toLowerCase())
        )
      }
    }
)

let addStudentForm = reactive<tinyStudentDataDisplay>({
  studentName: '',
  studentClass: '',
  studentClassLevel: '',
  studentSex: 'M',
  studentAge: 1,
})

const handleClose = (done: Function) => {
  ElMessageBox.confirm('Do you want to exit?')
      .then(() => {
        addStudentForm.studentName = ''
        addStudentForm.studentClass = ''
        addStudentForm.studentClassLevel = ''
        addStudentForm.studentSex = 'M'
        addStudentForm.studentAge = 1
        done()
      })
      .catch(() => {
      })
}

const toggleAddStudentForm = () => {
  if (addStudentForm) {
    let {studentAge, studentClass, studentName, studentSex} = addStudentForm
    if ((studentAge >= 10 && studentAge <= 18) && studentName.trim() !== "" && studentClass !== "" && studentSex !== "") {
      insertStudent(store.jwt, addStudentForm).then(d => {
        addStudentDialogVisible.value = false
        ElMessage.success('Successfully done.')
      }).catch(e => {
        ElMessage.error('Unexpected error occurred.')
        console.error(e)
      })
    }
  }
}

const exportTable = () => {
  exportStudentTable(store.jwt).then(res => {
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', "Student Excel.xlsx")
    document.body.appendChild(link)
    link.click()

    ElMessage.success('Ready.')
  }).catch(e => {
    ElMessage.error('Unexpected error occurred.')
  })
}

const beforeUploadTable = (file: UploadRawFile) => {
  if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      file.type !== "application/vnd.ms-excel") {
    ElMessage.error('File type not allowed.')
    return false
  }
  console.log(file.size, file.size / 1024 / 1024)
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

const modifyStudents = reactive({
  studentUuid: 0,
  studentName: '',
  studentClass: '',
  studentSex: '',
  studentAge: 1,
  isExpired: 0
})
const modifySettings: Ref<string[]> = ref([])
const submitModifyStudent = () => {
  if (modifySettings.value.includes("Student ID") || modifySettings.value.includes("Student Password")) {
    if (!modifyStudents.studentClass) {
      ElMessage.error("Student Class is required.")
    }
  }

  const submitForm: modifyStudentType = {
    ...modifyStudents,
    modifyStudentId: false,
    modifyStudentPassword: false,
  }

  submitForm.modifyStudentId = modifySettings.value.includes("Student ID")
  submitForm.modifyStudentPassword = modifySettings.value.includes("Student Password")
  submitForm.isExpired = modifySettings.value.includes("Set as Inactive") ? 1 : 0

  modifyStudent(store.jwt, submitForm).then(d => {
    modifyStudentDialogVisible.value = false
    ElMessage.success('Done.')
  }).catch(e => {
    ElMessage.error('Unexpected error occurred.')
  })
}

watch(currentRow, v => {
  if (v) {
    let {studentUuid, studentName, studentClass, studentSex, studentAge, isExpired} = v as studentDataDisplay
    modifyStudents.studentUuid = studentUuid
    modifyStudents.studentName = studentName
    modifyStudents.studentClass = studentClass
    modifyStudents.studentSex = studentSex
    modifyStudents.studentAge = studentAge
    modifyStudents.isExpired = isExpired
  }
})
</script>

<template>
  <div class="container">
    <el-row style="margin: 8px 0 8px 0">
      <el-button plain type="primary" @click="addStudentDialogVisible = true">Add Students</el-button>
      <el-button :icon="Upload" bg text type="info" @click="importDialogVisible = true">Import</el-button>
      <el-button :icon="Download" bg text type="info" @click="exportTable">Export</el-button>

      <el-button v-if="currentRow" :icon="Edit" type="primary" @click="modifyStudentDialogVisible = true">Modify student
        "{{ currentRow.studentName }}"
      </el-button>
    </el-row>
    <el-table ref="singleTableRef" v-loading="isTableDataLoading" :data="filterTableData"
              :default-sort="{ prop: 'studentName', order: 'ascending' }" height="100%"
              highlight-current-row
              style="width: 100%" @current-change="handleCurrentChange">
      <el-table-column type="expand">
        <template #default="props">
          <el-descriptions
              border
              title="Student details"
          >
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Coordinate/>
                  </el-icon>
                  ID
                </div>
              </template>
              {{ props.row.studentId }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <UserFilled/>
                  </el-icon>
                  Name
                </div>
              </template>
              {{ props.row.studentName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <HomeFilled/>
                  </el-icon>
                  Class
                </div>
              </template>
              {{ props.row.studentClassLevel }}, {{ props.row.studentClass }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Male/>
                  </el-icon>
                  Sex
                </div>
              </template>
              {{ props.row.studentSex === "F" ? "Female" : "Male" }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Male/>
                  </el-icon>
                  Age
                </div>
              </template>
              {{ props.row.studentAge }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Tickets/>
                  </el-icon>
                  Status
                </div>
              </template>
              <el-tag v-if="props.row.isExpired === 0" type="success">Active</el-tag>
              <el-tag v-if="props.row.isExpired === 1" type="danger">Inactive</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Tickets/>
                  </el-icon>
                  DP count
                </div>
              </template>
              {{ props.row.dp ? props.row.dp : 0 }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Tickets/>
                  </el-icon>
                  Appealed count
                </div>
              </template>
              {{ props.row.appealedCount }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column label="Class Level" prop="studentClassLevel"/>
      <el-table-column label="Class" prop="studentClass"/>
      <el-table-column label="Name" prop="studentName" sortable/>
      <el-table-column align="right">
        <template #header>
          <el-input v-model="selectedAutocompleteItem" placeholder="Type to search in each page" size="small"/>
        </template>
        <template #default="scope">
          <el-tag v-if="scope.row.isExpired === 0" type="success">Active</el-tag>
          <el-tag v-if="scope.row.isExpired === 1" type="danger">Inactive</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="allClasses !== undefined" :current-page.sync="currentPage"
                   :page-count="allClasses!.length"
                   :pager-count="9"
                   :teleported="false"
                   background
                   class="paginationClass"
                   hide-on-single-page
                   layout="prev, pager, next"
                   @current-change="handlePaginationChange"
    />
    <el-drawer
        ref="drawerRef"
        v-model="addStudentDialogVisible"
        :before-close="handleClose"
        direction="ltr"
        title="Add Student Form"
    >
      <div>
        <el-form :model="addStudentForm">
          <el-form-item label="Student Name" required>
            <el-input v-model="addStudentForm.studentName" autocomplete="disable" placeholder="Student's name"/>
          </el-form-item>
          <el-form-item label="Student Class" required>
            <el-select v-model="addStudentForm.studentClass" placeholder="Select">
              <el-option
                  v-for="(item, i) in allClasses"
                  :key="i"
                  :lable="item"
                  :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Student Gender" required>
            <el-radio-group v-model="addStudentForm.studentSex">
              <el-radio label="M" value="M">Male</el-radio>
              <el-radio label="F" value="F">Female</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Student Age" required>
            <el-input-number v-model="addStudentForm.studentAge" :max="18" :min="11"/>
          </el-form-item>
        </el-form>
        <div>
          <el-button @click="toggleAddStudentForm">Add student</el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog
        v-model="importDialogVisible"
        :closable="false"
        align-center
        title="Import students from Excel"
        width="800"
    >
      <el-alert description='If "Student Class" field is empty, student id will not be generated.' show-icon
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
                 action="/api/uploadStudentExcel"
                 drag>
        <el-icon class="el-icon--upload">
          <UploadFilled/>
        </el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            <el-link href="/Student Excel Template.xlsx" type="primary">Click here</el-link>
            to download template.
          </div>
        </template>
      </el-upload>
    </el-dialog>
    <el-dialog
        v-model="modifyStudentDialogVisible"
        align-center
        destroy-on-close
        title="Edit student"
        width="700"
    >
      <el-form :model="modifyStudents">
        <el-form-item label="Student name" required>
          <el-input v-model="modifyStudents.studentName"></el-input>
        </el-form-item>
        <el-form-item label="Student Class" required>
          <el-select v-model="modifyStudents.studentClass" placeholder="Select">
            <el-option
                v-for="(item, i) in allClasses"
                :key="i"
                :lable="item"
                :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Student Gender" required>
          <el-radio-group v-model="modifyStudents.studentSex">
            <el-radio label="M" value="M">Male</el-radio>
            <el-radio label="F" value="F">Female</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Student Age" required>
          <el-input-number v-model="modifyStudents.studentAge" :max="18" :min="11"/>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-text class="assignOrResetText" type="info">Assign or reset:</el-text>
      <el-alert description='If "Student Class" field is empty, student id and password will not be generated.'
                show-icon style="margin-bottom: 24px"
                title="Notice"
                type="info"/>
      <el-checkbox-group v-model="modifySettings">
        <el-checkbox border label="Student ID" value="id"/>
        <el-checkbox border label="Student Password" value="password"/>
        <el-checkbox border label="Set as Inactive" value="active"/>
      </el-checkbox-group>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="modifyStudentDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitModifyStudent">
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

.paginationClass {
  margin-top: 10px;
  margin-bottom: 5px;
  display: flex;
}

.assignOrResetText {
  color: var(--el-text-color-regular);
  font-size: 18px;
  margin: 24px 0;
  display: block;
}
</style>