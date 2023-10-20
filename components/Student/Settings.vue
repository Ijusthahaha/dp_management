<script setup lang="ts">
import {useUserStore} from "~/composables/userStore";
import {Student} from "~/types/User";
import {storeToRefs} from "pinia";

const store = useUserStore()
const storeRef = storeToRefs(store)
const dpStore = useDPDataStore()

const changePasswordDialog = ref(false)
const newPassword = ref('')

const name = (store.user as Student).name
const clazz = (store.user as Student).clazz

const changePassword = function() {
  changePasswordDialog.value = true
}

const submitChangePassword = function() {
  // do ajax (important: update jwt)
  changePasswordDialog.value = false
}

const logout = function() {
  storeRef.jwt.value = ''
  localStorage.setItem("JWT", '')

  location.reload()
}
</script>

<template>
  <el-divider/>
  <el-descriptions title="Personal Info" size="large">
    <el-descriptions-item label="Class">{{ clazz }}</el-descriptions-item>
    <el-descriptions-item label="Name">{{ name }}</el-descriptions-item>
    <el-descriptions-item label="Total DP">{{ dpStore.getTotalDP }}</el-descriptions-item>
  </el-descriptions>

  <el-divider/>

  <div>
    <span class="titleText">Change password</span>
    <el-button type="primary" plain @click="changePassword">Click here</el-button>
  </div>

  <el-divider/>

  <div>
    <span class="titleText">Report bugs & suggestions</span>
    <el-link type="primary" href="mailto:ijusthahaha@outlook.com?subject=Report%20bugs%20%26%20suggestions">Click here</el-link>
    <span class="titleText" style="margin-left: 8px">OR</span>
    <el-text>Send email to</el-text>
    <el-text type="primary">ijusthahaha@outlook.com</el-text>
  </div>

  <el-divider/>

  <div>
    <span class="titleText">Logout</span>
    <el-button type="danger" plain @click="logout">Click here</el-button>
  </div>

  <el-divider/>

  <el-dialog
      v-model="changePasswordDialog"
      title="Change password"
      width="30%"
      align-center
  >
    <p>New Password:<el-input v-model="newPassword" type="password" show-password/></p>
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
</style>