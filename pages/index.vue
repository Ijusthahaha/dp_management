<script lang="ts" setup>
import {useUserStore} from "~/composables/userStore";

const store = useUserStore()
const type = store.user?.type as string
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

definePageMeta({
  middleware: 'auth-intercept'
})
</script>

<template>
  <div id="app">
    <Student v-if="type === 'student'"></Student>
    <Teacher v-else-if="type === 'teacher'"></Teacher>
    <Admin v-else-if="type === 'admin'"></Admin>
  </div>
</template>

<style scoped>

</style>