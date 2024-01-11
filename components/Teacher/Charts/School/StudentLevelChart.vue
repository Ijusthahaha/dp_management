<script lang="ts" setup>
import {Bar} from 'vue-chartjs'
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js'
import {useSchoolDPDataStore} from "~/composables/schoolDPDataStore";
import {storeToRefs} from "pinia";
import {ClassLevelConverter} from "~/utils/DPUtils";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const store = useSchoolDPDataStore()
const {schoolDP, isUpdatedDP} = storeToRefs(useSchoolDPDataStore())

const update = ref(false)
const studentMap = reactive<Map<string, number>>(new Map())
const classMapKey = ref()
const classMapValue = ref()

watch(isUpdatedDP, () => {
  for (let i = 0; i < schoolDP.value.length; i++) {
    let level = ClassLevelConverter(schoolDP.value[i].class_level)
    if (!studentMap.get(level)) studentMap.set(level, schoolDP.value[i].dp)
    else studentMap.set(level, studentMap.get(level) as number + schoolDP.value[i].dp)
  }

  update.value = true

  classMapKey.value = Array.from(studentMap.keys())
  classMapValue.value = Array.from(studentMap.values())
})

const data = reactive({
  labels: classMapKey,
  datasets: [
    {
      label: "Divisions' DP",
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
  aspectRatio: 3
}
</script>

<template>
  <Bar
      v-if="update"
      :data="data"
      :options="chartOptions">
  </Bar>
</template>

<style scoped>

</style>