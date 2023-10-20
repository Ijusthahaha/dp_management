<script setup>
import {storeToRefs} from "pinia";
import {useUserStore} from "~/composables/userStore";
import {validateJWT} from "~/utils/validateJWT";
import {createTeacher} from "~/utils/createUser";
import {TeacherType} from "~/types/User";

const store = useUserStore()
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
      <h1>Teacher / Admin Login Page</h1>
      <el-form :model="form" label-position="left" label-width="120px">
        <el-form-item label="Teacher ID" required>
          <el-input v-model.number="form.name" placeholder="Example: 202130109"/>
        </el-form-item>
        <el-form-item label="Password" required>
          <el-input v-model="form.password" type="password" autocomplete="off" placeholder="Your password"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Login</el-button>
          <el-link href="/login/student" type="primary">Student login</el-link>
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

