<script lang="ts" setup>
import {useUserStore} from "~/composables/userStore";
import {Chart, registerables} from 'chart.js';

const store = useUserStore()
const type = store.user?.type as string

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