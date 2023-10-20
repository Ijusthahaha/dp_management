<script setup lang="ts">
import {HomeFilled, Plus, User} from "@element-plus/icons-vue";
import {Student, Teacher, TeacherType} from "~/types/User"
import {Action, FormRules, TabPaneName, TabsPaneContext} from "element-plus";
import {useStudentStore} from "~/composables/studentStore";
import {$fetch} from "ofetch";
import {DPLog} from "~/types/DPType";
import SchoolOverview from "~/components/Teacher/SchoolOverview.vue";
import MessageBox from "~/components/Teacher/MessageBox.vue";
import ClassOverview from "~/components/Teacher/ClassOverview.vue";
import {Ref} from "@vue/reactivity";

const store = useUserStore()
const studentStore = useStudentStore()
const computedStudent = studentStore.students.map(terminal => {
  return {
    value: `${terminal.clazz} ${terminal.name}`,
    id: terminal.id
  }
})
const teacherLevel = () => {
  return (store.user as Teacher).level
}

const initTabs = function () {
  giveDPTabs.value.push({
    id: '1',
    title: 'DP Dispatcher',
  })
  tabIndex = 1
  editableTabsValue.value = '1'
  forms.value.push({
    currentStudent: '',
    date: '',
    detailDate: '',
    location: '',
    reason: '',
    dp: 1
  })
}

const giveDPTabs = ref([
  {
    id: '1',
    title: 'DP Dispatcher',
  }
])

let tabIndex = 1 // how many tabs
const editableTabsValue = ref('1') // current tab
// const includedTabValue = ref('1') // included non-dispatcher tab
const handleTabsEdit = (
    targetName: TabPaneName | undefined,
    action: 'remove' | 'add'
) => {
  if (action === 'add') {
    const newTabName = `${++tabIndex}`
    giveDPTabs.value.push({
      id: newTabName,
      title: 'DP Dispatcher ' + newTabName,
    })
    forms.value.push({
      currentStudent: '',
      date: '',
      detailDate: '',
      location: '',
      reason: '',
      dp: 1
    })
    editableTabsValue.value = newTabName
  } else if (action === 'remove') {
    const tabs = giveDPTabs.value
    let activeName = editableTabsValue.value
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.id === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.id
          }
        }
      })
    }
    forms.value = forms.value.filter((v, i) => {
      return i !== +activeName
    })

    tabIndex--
    editableTabsValue.value = (+activeName).toString()
    giveDPTabs.value = tabs.filter((tab) => tab.id !== targetName)

    let j = 1
    for (let i = 0; i < giveDPTabs.value.length; i++) {
      giveDPTabs.value[i].id = j.toString()
      j++
    }
  }
}

const forms = ref([{
  currentStudent: '',
  date: '',
  detailDate: '',
  location: '',
  reason: '',
  dp: 1
}])

const rules = reactive<FormRules>({
  currentStudent: [
    {required: true, message: "Please input a student name", trigger: "change"}
  ],
  date: [
    {required: true, message: "Please pick a date", trigger: "change"}
  ],
  detailDate: [
    {required: true, message: "Please pick a date", trigger: "change"}
  ],
  location: [
    {required: true, message: "Please input a location", trigger: "change"}
  ],
  reason: [
    {required: true, message: "Please provide a reason", trigger: "blur"}
  ],
  dp: [
    {required: true, message: "Please input the DP", trigger: "blur"}
  ]
})
const createFilter = (queryString: string) => {
  return (student: typeof computedStudent[number]) => {
    return (
        student.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}
const querySearchStudent = function (queryString: string, callback: Function) {
  const results = queryString
      ? computedStudent.filter(createFilter(queryString))
      : computedStudent
  callback(results)
}

const confirmDialogVisible = ref(false)
const checkForm = function () {
  let f = forms.value.at(+editableTabsValue.value - 1)
  if (f) {
    if (f.currentStudent &&
        f.date &&
        f.detailDate &&
        f.location &&
        f.reason &&
        f.dp) {
      confirmDialogVisible.value = true
      currentQuote.value = newQuote()
      return
    }
  }
  ElMessage({
    type: 'error',
    message: 'All columns are required.'
  })
}

const submitForm = function () {
  ElMessageBox.alert('DP Dispatched!', 'Message', {
    confirmButtonText: 'Close',
    callback: (action: Action) => {
      // send ajax
    }
  })
  confirmDialogVisible.value = false

  // close the tab
  let f = forms.value.at(+editableTabsValue.value - 1)
  f!.currentStudent = ''
  f!.date = ''
  f!.detailDate = ''
  f!.location = ''
  f!.reason = ''
  f!.dp = 1
}

let quote: string[];
onMounted(async () => {
  const data = await $fetch("/teacher_quote.txt")
  quote = data.toString().split("\r\n")
})

const currentQuote = ref("")
const newQuote = function () {
  return quote[Math.floor(Math.random() * quote.length)]
}

const dateFormatter = function (row: any): string {
  const date = new Date(row.date)
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`
}
</script>

<template>
  <div id="teacher">
    <el-container>
      <el-header>
        <el-page-header icon="null">
          <template #title>
            <el-icon>
              <HomeFilled/>
            </el-icon>
            <span>{{ teacherLevel() }}</span>
          </template>
          <template #content>
            <el-icon>
              <User/>
            </el-icon>
            <span>{{ store.user?.name }}</span>
          </template>
        </el-page-header>
      </el-header>
      <el-container>
        <el-main>
          <el-tabs
              v-model="editableTabsValue"
              type="card"
              @edit="handleTabsEdit"
              editable
              v-if="giveDPTabs.length > 0 || (store.user as Teacher).level !== TeacherType.Default"
          >
            <el-tab-pane key="overview" :closable="false" label="DP Overview"
                         v-if="teacherLevel() == TeacherType.Director" name="-1">
              <SchoolOverview></SchoolOverview>
            </el-tab-pane>
            <el-tab-pane key="messagebox" :closable="false" label="MessageBox"
                         v-if="teacherLevel() == TeacherType.Director" name="0">
              <MessageBox></MessageBox>
            </el-tab-pane>
            <el-tab-pane key="class" :closable="false" label="Class DP Overview"
                         v-if="teacherLevel() == TeacherType.CT" name="0">
              <ClassOverview></ClassOverview>
            </el-tab-pane>
            <el-tab-pane
                v-for="item in giveDPTabs"
                :key="item.id"
                :label="item.title"
                :name="item.id"
                closable
            >
              <el-card>
                <el-form v-model="forms" status-icon>
                  <el-form-item label="Input student's name" required>
                    <el-autocomplete
                        v-model="forms[+item.id - 1].currentStudent"
                        :fetch-suggestions="querySearchStudent"
                        clearable
                        placeholder="Example: MRD Leo"
                        :trigger-on-focus="false"
                    />
                  </el-form-item>
                  <el-form-item label="Dispatch date" required>
                    <el-col :span="11">
                      <el-date-picker
                          v-model="forms[+item.id - 1].date"
                          type="date"
                          placeholder="Pick a date"
                          style="width: 100%"
                      />
                    </el-col>
                    <el-col :span="1" style="text-align: center">
                      <span style="color: #6b6d71">-</span>
                    </el-col>
                    <el-col :span="11">
                      <el-time-picker
                          v-model="forms[+item.id - 1].detailDate"
                          placeholder="Pick a time"
                          style="width: 100%"
                      />
                    </el-col>
                  </el-form-item>
                  <el-form-item label="Dispatch location" required>
                    <el-radio-group v-model="forms[+item.id- 1].location">
                      <el-radio label="Academic"/>
                      <el-radio label="Dorm"/>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="Reason" required>
                    <el-input v-model="forms[+item.id - 1].reason"
                              type="textarea"
                              :autosize="{minRows: 3}"
                              maxlength="100"
                              show-word-limit
                              placeholder="Please provide reasonable reason."
                    />
                  </el-form-item>
                  <el-form-item label="DP: " required>
                    <el-col :span="4">
                      <el-input type="number" placeholder="Dispatch DP count" v-model="forms[+item.id - 1].dp"
                                :max="12" :min="1"></el-input>
                    </el-col>
                    <el-col :span="1"></el-col>
                    <el-col :span="18">
                      <el-button type="primary" @click="checkForm" plain>Dispatch!</el-button>
                    </el-col>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-tab-pane>
          </el-tabs>
          <el-empty v-else description="Click anywhere to create a DP Dispatcher." @click="initTabs">
          </el-empty>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <el-dialog v-model="confirmDialogVisible" title="Confirm" width="50%" center>
    <el-table :data="[forms[+editableTabsValue - 1]]" style="width: 100%">
      <el-table-column prop="currentStudent" label="Name"></el-table-column>
      <el-table-column prop="date" label="Date" :formatter="dateFormatter"></el-table-column>
      <el-table-column prop="location" label="Location"></el-table-column>
      <el-table-column prop="reason" label="Reason"></el-table-column>
      <el-table-column prop="dp" label="DP"></el-table-column>
    </el-table>
    <el-alert :title="currentQuote" type="info"
              show-icon style="margin-top: 8px; margin-bottom: 8px;" :closable="false"/>
    <el-alert title="You are not able to cancel the DP." type="warning"
              show-icon style="margin-top: 8px; margin-bottom: 8px;" :closable="false"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">Cancel</el-button>
        <el-button type="danger" plain @click="submitForm">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
#teacher, .el-container {
  height: 100%;
  width: 100%;
}

.el-header {
  width: 100%;
  display: flex;
  justify-content: center;
}

.el-page-header {
  display: flex;
  align-items: center;
  height: 100%;
  border-bottom: 1px solid var(--el-border-color);
}

i {
  margin-right: 4px;
}

.el-menu, .el-main, .el-empty {
  height: 100%;
}

.el-empty {
  cursor: pointer;
}

.el-tab-pane {
  height: 100%;
}

.el-tabs--card {
  height: 80vh; /* idk why (height: 100%) not working... */
  /* overflow-y: auto; */
}
.el-tab-pane {
  height: 80vh;
  overflow-x: auto;
}
</style>