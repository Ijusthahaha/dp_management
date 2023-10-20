<script setup>
import {useUserStore} from "~/composables/userStore";
import {storeToRefs} from "pinia";
import {validateJWT} from "~/utils/validateJWT";
import {createStudent} from "/utils/createUser"

const store = useUserStore()
const refStore = storeToRefs(store)
const form = reactive({
  name: '',
  password: ''
})
const onSubmit = () => {
  // get status: 403? 200? jwt? user type?
  if (validateJWT(store.jwt).status === 200) {
    ElMessage({
      type: 'success',
      message: 'Login successful.'
    })
    navigateTo('/')
  } else {
    ElMessage({
      type: 'error',
      message: 'Username or password is incorrect.'
    })
  }
}

onMounted(() => {
  if (validateJWT(store.jwt).status === 200) {
    ElMessage({
      type: 'success',
      message: 'Login successful.'
    })
    navigateTo('/')
  }
})
</script>

<template>
  <div class="loginContainer">
    <el-card class="loginForm">
      <h1>Student DP Management System</h1>
      <el-form :model="form" label-position="left" label-width="120px">
        <el-form-item label="Student ID" required>
          <el-input v-model.number="form.name" placeholder="Example: 202130109"/>
        </el-form-item>
        <el-form-item label="Password" required>
          <el-input v-model="form.password" type="password" autocomplete="off" placeholder="Your password"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Login</el-button>
          <el-link href="/login/teacher" type="primary">Teacher / Admin login</el-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
h1 {
  display: block;
  margin-bottom: 16px;
  color: #409EFF;
}

.loginContainer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.loginForm {
  padding: 32px;
  border-radius: 8px;
}
.el-link {
  margin-left: 8px;
}
</style>

