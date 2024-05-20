<script lang="ts" setup>
import {useUserStore} from "~/composables/userStore";
import type {Student} from "~/types/User";
import {storeToRefs} from "pinia";
import {changeStudentPassword} from "~/utils/fetch";

const store = useUserStore()
const storeRef = storeToRefs(store)
const dpStore = useDPDataStore()

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
        ElMessage.success("Done. Please relog.")
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
  <el-descriptions size="large" title="Personal Info">
    <el-descriptions-item label="Type">{{ type }}</el-descriptions-item>
    <el-descriptions-item label="Id">{{ id }}</el-descriptions-item>
    <el-descriptions-item label="Level">{{ level }}</el-descriptions-item>
    <el-descriptions-item label="Class">{{ clazz }}</el-descriptions-item>
    <el-descriptions-item label="Name">{{ name }}</el-descriptions-item>
    <el-descriptions-item label="Total DP">{{ dpStore.getTotalDP }}</el-descriptions-item>
  </el-descriptions>
  <el-divider/>

  <el-descriptions border size="large" title="Preference">
    <el-descriptions-item label="Theme">{{ store.theme }}</el-descriptions-item>
    <el-descriptions-item label="Language">{{ store.language }}</el-descriptions-item>
    <el-descriptions-item label="Font">{{ store.font ? store.font : "default" }}</el-descriptions-item>
  </el-descriptions>

  <el-divider/>

  <div class="modifiers">
    <div class="modifiers1">
      <span class="titleText">Change password</span>
      <el-button plain type="primary" @click="changePassword">Click here</el-button>
    </div>

    <div class="modifiers2">
      <span class="titleText">Logout</span>
      <el-button plain type="danger" @click="logout">Click here</el-button>
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
      align-center
      title="Change password"
      width="30%"
  >
    <p>New Password:
      <el-input v-model="newPassword" show-password type="password"/>
    </p>
    <template #footer>
      <span>
        <el-button @click="changePasswordDialog = false">Cancel</el-button>
        <el-button type="primary" @click="submitChangePassword">
          Confirm
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