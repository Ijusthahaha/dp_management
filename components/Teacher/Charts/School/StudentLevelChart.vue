<script lang="ts" setup>
import {Bar} from 'vue-chartjs'
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js'
import {useSchoolDPDataStore} from "~/composables/schoolDPDataStore";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const store = useSchoolDPDataStore()

const studentMap: Map<string, number> = new Map()
for (let i = 0; i < store.schoolDP.length; i++) {
  let level = store.schoolDP[i].level
  studentMap.set(level, 0)
  for (let j = 0; j < store.schoolDP[i].dpLog.length; j++) {
    let levelDP = store.schoolDP[i].dpLog[j].dp
    studentMap.set(level, studentMap.get(level) as number + levelDP)
  }
}

const data = {
  labels: Array.from(studentMap.keys()),
  datasets: [
    {
      label: "Divisions' DP",
      data: Array.from(studentMap.values()),
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
}
const chartOptions = {
  responsive: true,
  aspectRatio: 3
}
</script>

<template>
  <Bar
      :data="data"
      :options="chartOptions">
  </Bar>
</template>

<style scoped>

</style>