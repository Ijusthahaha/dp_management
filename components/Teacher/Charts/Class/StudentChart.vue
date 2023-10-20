<script setup lang="ts">
// show each student's dp.

import {Bar} from 'vue-chartjs'
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale} from 'chart.js'
import {useClassDPDataStore} from "~/composables/classDPDataStore";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const store = useClassDPDataStore()

const studentMap: Map<string, number> = new Map()
for (let i=0; i<store.classDP.length; i++) {
  let studentName = store.classDP[i].name
  let studentDP = store.classDP[i].dp

  if (!studentMap.has(studentName)) {
    studentMap.set(studentName, studentDP)
  } else {
    studentMap.set(studentName, studentMap.get(studentName) as number + studentDP)
  }
}

const data = {
  labels: Array.from(studentMap.keys()),
  datasets: [
    {
      label: "Student's DP",
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
      :options="chartOptions"
      :data="data">
  </Bar>
</template>

<style scoped>

</style>