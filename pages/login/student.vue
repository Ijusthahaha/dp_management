<script setup>
import {useUserStore} from "~/composables/userStore";
import {validateStudentJwt} from "~/utils/studentApiUtils";
import {studentLogin} from "~/utils/fetch";

const store = useUserStore()
const form = reactive({
  name: '',
  password: ''
})
const onSubmit = () => {
  studentLogin({
    studentId: form.name,
    studentPassword: form.password
  }).then(data => {
        if (data.data.code === 200) {
          store.$patch(state => {
            state.jwt = data.data.data.token
          })
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
  )
}

onMounted(() => {
  validateStudentJwt(store.jwt).then(async data => {
    if (data.status === 200) {
      ElMessage({
        type: 'success',
        message: 'Login successful.'
      })
      await navigateTo('/')
    }
  })
})
</script>

<template>
  <div class="loginContainer">
    <el-card class="loginForm">
      <h1>{{ $t('login.student.project') }}</h1>
      <h2>{{ $t('login.student.project_sub') }}</h2>
      <el-form :model="form" label-position="left" label-width="120px">
        <el-form-item label="Student ID" required>
          <el-input v-model.number="form.name" :placeholder="$t('login.student.example') + '202130109'"/>
        </el-form-item>
        <el-form-item label="Password" required>
          <el-input v-model="form.password" :placeholder="$t('login.student.password')" autocomplete="off"
                    type="password"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ $t('login.student.login_button') }}</el-button>
          <el-link href="/login/teacher" type="primary">{{ $t('login.student.switch') }}</el-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
h1, h2 {
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
  min-height: 20vh;
  min-width: 40vw;
  padding: 32px;
  border-radius: 8px;
}

.el-link {
  margin-left: 8px;
}
</style>

