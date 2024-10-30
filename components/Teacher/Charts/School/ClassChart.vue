<script lang="ts" setup>
import {Bar} from 'vue-chartjs'
import {useSchoolDPDataStore} from "~/composables/schoolDPDataStore";
import {storeToRefs} from "pinia";
import type {Ref} from "@vue/reactivity";
import {getAllLogs} from "~/utils/fetch";
import {formatGetAllLogs} from "~/utils/DPUtils";
import type {DPLog} from "~/types/DPType";

const {schoolDP, isUpdatedDP} = storeToRefs(useSchoolDPDataStore())
const classMap = reactive<Map<string, number>>(new Map())
const update = ref(false)
const classes: Ref<string[]> = ref([])
let d = reactive<Map<string, DPLog[]>>(new Map())
const classMapKey = ref()
const classMapValue = ref()

// will bugs occur if fetched data in here? (cus fetch should be called at the global)
getAllLogs().then(data => {
  const logs = []
  // must verify date
  const currentYear = new Date().getFullYear();
  const semesterStartDate = new Date(currentYear, 8, 1); // semester year begins with 9.1
  const semesterEndDate = new Date(currentYear + 1, 7, 31, 23, 59, 59); // semester year ends with 8.31
  for (let i=0; i<data.data.data.length; i++) {
    const t = data.data.data[i]
    const date = new Date(t.date)
    if (date >= semesterStartDate && date <= semesterEndDate) {
      logs.push(t)
    }
  }
  d = formatGetAllLogs(logs)
  schoolDP.value = logs
  isUpdatedDP.value = true
})

watch(isUpdatedDP, () => {
  classes.value = Object.keys(d)
  for (let i = 0; i < classes.value.length; i++) {
    classMap.set(classes.value[i], 0)
  }

  d.forEach((value, key) => {
    let dp = 0
    for (let i = 0; i < value.length; i++) {
      dp += value[i].dp
    }
    classMap.set(key, dp)
  })
  update.value = true

  classMapKey.value = Array.from(classMap.keys())
  classMapValue.value = Array.from(classMap.values())
})

const data = reactive({
  labels: classMapKey,
  datasets: [
    {
      label: "Class's DP",
      data: classMapValue,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

</script>

<template>
  <div class="chartContainer">
    <Bar
        v-if="update"
        :data="data"
        :options="chartOptions">
    </Bar>
  </div>
</template>

<style scoped>
.chartContainer {
  position: relative;
  height: calc(100% - 20px - 20px - 20px);
}
</style>