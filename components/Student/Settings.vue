<script lang="ts" setup>
import {useUserStore} from "~/composables/userStore";
import type {Student} from "~/types/User";
import {storeToRefs} from "pinia";
import {changeStudentPassword} from "~/utils/fetch";

const store = useUserStore()
const storeRef = storeToRefs(store)
const dpStore = useDPDataStore()
const {t} = useI18n()

const changePasswordDialog = ref(false)
const newPassword = ref('')

const type = (store.user as Student).type
const level = (store.user as Student).level
const id = (store.user as Student).id
const name = (store.user as Student).name
const clazz = (store.user as Student).clazz

const changePassword = function () {
  changePasswordDialog.value = true
}

const submitChangePassword = function () {
  changeStudentPassword(store.jwt, newPassword.value)
      .then((data) => {
        ElMessage.success(t('student.menu.settings.relog'))
        logout(data.data.data.token)
      })
}

const logout = function (jwt?: string) {
  if (jwt) {
    storeRef.jwt.value = jwt
    localStorage.setItem("JWT", jwt)
    location.reload()
    return
  }
  storeRef.jwt.value = ''
  localStorage.setItem("JWT", '')

  location.reload()
}
</script>

<template>
  <el-divider/>
  <el-descriptions :title="t('student.menu.settings.info')" size="large">
    <el-descriptions-item :label="t('student.menu.settings.type')">{{ type }}</el-descriptions-item>
    <el-descriptions-item label="Id">{{ id }}</el-descriptions-item>
    <el-descriptions-item :label="t('student.menu.settings.level')">{{ level }}</el-descriptions-item>
    <el-descriptions-item :label="t('student.menu.settings.class')">{{ clazz }}</el-descriptions-item>
    <el-descriptions-item :label="t('student.menu.settings.name')">{{ name }}</el-descriptions-item>
    <el-descriptions-item :label="t('student.menu.settings.total')">{{ dpStore.getTotalDP }}</el-descriptions-item>
  </el-descriptions>
  <el-divider/>

  <el-descriptions :title="t('student.menu.settings.preference')" border size="large">
    <el-descriptions-item :label="t('student.menu.settings.theme')">{{ store.theme }}</el-descriptions-item>
    <el-descriptions-item :label="t('student.menu.settings.language')">{{ store.language }}</el-descriptions-item>
    <el-descriptions-item :label="t('student.menu.settings.font')">{{
        store.font ? store.font : "default"
      }}
    </el-descriptions-item>
  </el-descriptions>

  <el-divider/>

  <div class="modifiers">
    <div class="modifiers1">
      <span class="titleText">{{ $t('student.menu.settings.change_password') }}</span>
      <el-button plain type="primary" @click="changePassword">{{ $t('student.menu.settings.click_here') }}</el-button>
    </div>

    <div class="modifiers2">
      <span class="titleText">{{ $t('student.menu.settings.logout') }}</span>
      <el-button plain type="danger" @click="logout()">{{ $t('student.menu.settings.click_here') }}</el-button>
    </div>
  </div>

  <el-divider/>

  <!--  <div>-->
  <!--    <span class="titleText">Report bugs & suggestions</span>-->
  <!--    <el-link href="mailto:ijusthahaha@outlook.com?subject=Report%20bugs%20%26%20suggestions" type="primary">Click here-->
  <!--    </el-link>-->
  <!--    <span class="titleText" style="margin-left: 8px">OR</span>-->
  <!--    <el-text>Send email to</el-text>-->
  <!--    <el-text type="primary">ijusthahaha@outlook.com</el-text>-->
  <!--  </div>-->

  <!--  <el-divider/>-->

  <!--  <div>-->
  <!--    <span class="titleText">Logout</span>-->
  <!--    <el-button plain type="danger" @click="logout">Click here</el-button>-->
  <!--  </div>-->

  <!--  <el-divider/>-->

  <el-dialog
      v-model="changePasswordDialog"
      :title="t('student.menu.settings.change_password')"
      align-center
      width="30%"
  >
    <p>{{ $t('student.menu.settings.new_password') }}
      <el-input v-model="newPassword" show-password type="password"/>
    </p>
    <template #footer>
      <span>
        <el-button @click="changePasswordDialog = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitChangePassword">
          {{ $t('common.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.titleText {
  font-weight: 700;
  font-size: 16px;
  margin-right: 8px;
}

.el-text {
  margin-right: 8px;
}

a {
  vertical-align: text-bottom;
}

.modifiers {
  width: 100%;
}

.modifiers1 {
  display: inline-block;
  width: 33%;
}

.modifiers2 {
  display: inline-block;
}
</style>