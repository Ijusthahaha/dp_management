<script lang="ts" setup>
import {HomeFilled, Right, User} from "@element-plus/icons-vue";
import type {Student, Teacher} from "~/types/User"
import {TeacherType} from "~/types/User"
import type {Action, FormRules, TabPaneName} from "element-plus";
import {useStudentStore} from "~/composables/studentStore";
import {$fetch} from "ofetch";
import SchoolOverview from "~/components/Teacher/SchoolOverview.vue";
import MessageBox from "~/components/Teacher/MessageBox.vue";
import ClassOverview from "~/components/Teacher/ClassOverview.vue";
import {DPType, DPTypeExtraInfo, Location} from "~/types/DPType";
import {getStudents, postLogs} from "~/utils/fetch";
import {createStudent} from "~/utils/createUser";
import type {Ref} from "@vue/reactivity";
import {storeToRefs} from "pinia";
import type {Form} from "~/types/Status";
import ProfileChecker from "~/components/Teacher/ProfileChecker.vue";

let quote: string[];
onMounted(async () => {
  const data = await $fetch("/quotes/teacher_quote.txt")
  quote = data.toString().split("\r\n")
})

const store = useUserStore()
const studentStore = useStudentStore()
const {students} = storeToRefs(useStudentStore())
const {t} = useI18n()

const computedStudent = computed(() => {
  return students.value.map(terminal => {
    return {
      value: `${terminal.clazz} ${terminal.name}`,
      id: terminal.id
    }
  })
})
const teacherLevel = () => {
  return (store.user as Teacher).level
}

const initTabs = function () {
  giveDPTabs.value.push({
    id: '1',
    title: t("teacher.dispatcher"),
  })
  tabIndex = 1
  editableTabsValue.value = '1'
  forms.value.push({
    currentStudent: {
      name: "",
      id: undefined
    },
    date: 0,
    detailDate: 0,
    location: '',
    type: undefined,
    reason: '',
    dp: 1
  })
}

const giveDPTabs = ref([
  {
    id: '1',
    title: t("teacher.dispatcher"),
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
      title: t("teacher.dispatcher") + newTabName,
    })
    forms.value.push({
      currentStudent: {
        name: "",
        id: undefined
      },
      date: 0,
      detailDate: 0,
      location: '',
      type: undefined,
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

const forms: Ref<Form[]> = ref([{
  currentStudent: {
    name: '',
    id: undefined
  },
  date: 0,
  detailDate: 0,
  location: '',
  type: undefined,
  reason: '',
  dp: 1
}])

const querySearchStudent = function (queryString: string, callback: Function) {
  getStudents(queryString).then(d => {
    let b: Student[] = []
    for (let i = 0; i < d.data.data.length; i++) {
      let c = d.data.data[i]
      b.push(createStudent(c.studentId, c.studentName, c.studentClass, undefined))
    }
    studentStore.$patch(state => {
      state.students = b
    })
    callback(computedStudent.value)
  })
}

const confirmDialogVisible = ref(false)
const checkForm = function () {
  let f = forms.value.at(+editableTabsValue.value - 1)
  if (f) {
    if (f.currentStudent.name &&
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
    message: t("teacher.submit_error")
  })
}

const submitForm = function () {
  ElMessageBox.alert(t("teacher.submit_succeed"), 'Message', {
    confirmButtonText: 'Close',
    callback: (action: Action) => {
      // close the tab
      let f = forms.value.at(+editableTabsValue.value - 1)
      postLogs(store.jwt, f!).then(() => {
        f!.currentStudent.name = ''
        f!.currentStudent.id = undefined
        f!.date = 0
        f!.detailDate = 0
        f!.location = ''
        f!.type = undefined
        f!.reason = ''
        f!.dp = 1
      })
    }
  })
  confirmDialogVisible.value = false
}

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

const DPTypes: Ref<string[]> = ref([])

const handleSelectAutocomplete = (item: { value: string, id: number }) => {
  let f = forms.value.at(+editableTabsValue.value - 1)!.currentStudent
  f.name = item.value
  f.id = item.id
}

watchEffect(() => {
  forms.value.forEach((form) => {
    if (form.type) {
      const suggestion = DPTypeExtraInfo[DPType[form.type as keyof typeof DPType]].suggestion
      if (suggestion) {
        form.dp = suggestion as number
      }
    }
    const location = form.location
    if (location.toLowerCase() == Location.academic) { // is academic
      DPTypes.value = (Object.keys(DPType) as Array<keyof DPType>).filter(v => isNaN(Number(v)))
    } else if (location.toLowerCase() === Location.dorm) {
      DPTypes.value = (Object.keys(DPType) as Array<keyof DPType>).filter(v => isNaN(Number(v))).filter(v => DPTypeExtraInfo[DPType[v as keyof typeof DPType]].location == Location.dorm)
    }
  })
})

const logout = () => {
  store.$patch(state => {
    state.jwt = ''
    localStorage.setItem("JWT", '')
    location.reload()
  })
}
</script>

<template>
  <div id="teacher">
    <el-container>
      <el-header style="justify-content: space-between">
        <el-page-header icon="null" style="margin: 0 auto">
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
        <el-link :underline="false" @click="logout">Logout<el-icon class="el-icon--right"><Right /></el-icon></el-link>
      </el-header>
      <el-container>
        <el-main>
          <el-tabs
              v-if="giveDPTabs.length > 0 || (store.user as Teacher).level !== TeacherType.Default"
              v-model="editableTabsValue"
              editable
              type="card"
              @edit="handleTabsEdit"
          >
            <el-tab-pane v-if="teacherLevel() == TeacherType.Director" key="profile" :closable="false"
                         :label="t('teacher.menu.profile')" name="-2">
              <ProfileChecker></ProfileChecker>
            </el-tab-pane>
            <el-tab-pane v-if="teacherLevel() == TeacherType.Director" key="overview" :closable="false"
                         :label="t('teacher.menu.overview')" name="-1">
              <SchoolOverview></SchoolOverview>
            </el-tab-pane>
            <el-tab-pane v-if="teacherLevel() == TeacherType.Director" key="messagebox" :closable="false"
                         :label="t('teacher.menu.messagebox')" name="0">
              <MessageBox></MessageBox>
            </el-tab-pane>
            <el-tab-pane v-if="teacherLevel() == TeacherType.CT" key="class" :closable="false"
                         :label="t('teacher.menu.class_overview')" name="0">
              <ClassOverview></ClassOverview>
            </el-tab-pane>
            <el-tab-pane
                v-for="item in giveDPTabs"
                :key="item.id"
                :label="item.title"
                :name="item.id"
                closable
            >
              <el-card shadow="always">
                <el-form v-model="forms" status-icon>
                  <el-form-item :label="t('teacher.menu.tab.form')" required>
                    <el-autocomplete
                        v-model="forms[+item.id - 1].currentStudent.name"
                        :fetch-suggestions="querySearchStudent"
                        :trigger-on-focus="false"
                        clearable
                        :placeholder="t('teacher.menu.tab.example')"
                        @select="handleSelectAutocomplete"
                    />
                  </el-form-item>
                  <el-form-item :label="t('teacher.menu.tab.dispatch_date')" required>
                    <el-col :span="11">
                      <el-date-picker
                          v-model="forms[+item.id - 1].date"
                          :placeholder="t('teacher.menu.tab.pick_date')"
                          style="width: 100%"
                          type="date"
                          value-format="x"
                      />
                    </el-col>
                    <el-col :span="1" style="text-align: center">
                      <span style="color: #6b6d71">-</span>
                    </el-col>
                    <el-col :span="11">
                      <el-time-picker
                          v-model="forms[+item.id - 1].detailDate"
                          :placeholder="t('teacher.menu.tab.pick_time')"
                          style="width: 100%"
                          value-format="hh:mm:ss"
                      />
                    </el-col>
                  </el-form-item>
                  <el-form-item :label="t('teacher.menu.tab.dispatch_location')" required>
                    <el-radio-group v-model="forms[+item.id - 1].location">
                      <el-radio :label="t('teacher.menu.tab.type.academic')"/>
                      <el-radio :label="t('teacher.menu.tab.type.dorm')"/>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="t('teacher.menu.tab.dp_type')" required>
                    <el-select v-model="forms[+item.id - 1].type" :placeholder="t('common.select')">
                      <el-option
                          v-for="(item, index) in DPTypes"
                          :key="index"
                          :label="item"
                          :value="item"
                      />
                    </el-select>
                    <el-alert type="success" v-if="forms[+item.id - 1].type && DPTypeExtraInfo[DPType[forms[+item.id - 1].type as keyof typeof DPType]].suggestion" style="margin-top: 18px" show-icon :closable="false">
                      The recommend DPs for type "{{forms[+item.id - 1].type}}" is {{DPTypeExtraInfo[DPType[forms[+item.id - 1].type as keyof typeof DPType]].suggestion}}
                    </el-alert>
                  </el-form-item>
                  <el-form-item :label="t('teacher.menu.tab.reason')" required>
                    <el-input v-model="forms[+item.id - 1].reason"
                              :autosize="{minRows: 3}"
                              maxlength="100"
                              :placeholder="t('teacher.menu.tab.dispatch_reason')"
                              show-word-limit
                              type="textarea"
                    />
                  </el-form-item>
                  <el-form-item label="DP: " required>
                    <el-col :span="4">
                      <el-input v-model="forms[+item.id - 1].dp" :max="12" :min="1" :step="1"
                                oninput="if (value > 12) value=12"
                                :placeholder="t('teacher.menu.tab.count')" type="number"></el-input>
                    </el-col>
                    <el-col :span="1"></el-col>
                    <el-col :span="18">
                      <el-button plain type="primary" @click="checkForm">{{$t('teacher.menu.tab.do_it')}}</el-button>
                    </el-col>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-tab-pane>
          </el-tabs>
          <el-empty v-else :description="t('teacher.menu.tab.create')" @click="initTabs">
          </el-empty>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <el-dialog v-if="confirmDialogVisible" v-model="confirmDialogVisible" center :title="t('common.confirm')" width="50%">
    <el-table :data="[forms[+editableTabsValue - 1]]" style="width: 100%">
      <el-table-column :label="t('teacher.menu.tab.name')" prop="currentStudent.name"></el-table-column>
      <el-table-column :formatter="dateFormatter" :label="t('teacher.menu.tab.date')" prop="date"></el-table-column>
      <el-table-column :label="t('teacher.menu.tab.location')" prop="location"></el-table-column>
      <el-table-column :label="t('teacher.menu.tab.reason')" prop="reason"></el-table-column>
      <el-table-column label="DP" prop="dp"></el-table-column>
    </el-table>
    <el-alert :closable="false" :title="currentQuote"
              show-icon style="margin-top: 8px; margin-bottom: 8px;" type="info"/>
    <el-alert :closable="false" show-icon
              style="margin-top: 8px; margin-bottom: 8px;" :title="t('teacher.menu.tab.warning')" type="warning"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">{{$t("common.cancel")}}</el-button>
        <el-button plain type="danger" @click="submitForm">
          {{$t("common.confirm")}}
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
  height: 100%;
}
</style>