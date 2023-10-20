<script setup lang="ts">
import {Bar} from 'vue-chartjs'
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale} from 'chart.js'
import {useSchoolDPDataStore} from "~/composables/schoolDPDataStore";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const store = useSchoolDPDataStore()

const classMap: Map<string, number> = new Map()

const classes = store.getClasses()
for (let i = 0; i < classes.length; i++) {
  classMap.set(classes[i], 0)
}

for (let i = 0; i < store.schoolDP.length; i++) {
  for (let j = 0; j < store.schoolDP[i].dpLog.length; j++) {
    classMap.set(store.schoolDP[i].clazz, (classMap.get(store.schoolDP[i].clazz) as number) + store.schoolDP[i].dpLog[j].dp)
  }
}

const data = {
  labels: classes,
  datasets: [
    {
      label: "Class's DP",
      data: Array.from(classMap.values()),
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