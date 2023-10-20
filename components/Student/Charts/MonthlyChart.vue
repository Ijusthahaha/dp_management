<script setup lang="ts">
import {Bar} from 'vue-chartjs'
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale} from 'chart.js'
import {useDPDataStore} from "~/composables/DPDataStore";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const {computedUserDP} = useDPDataStore()

const dpData: number[] = []
for (let i = 0; i < 12; i++) {
  let array: number[] = []

  for (let j = 0; j < computedUserDP.length; j++) {
    let date = new Date(+computedUserDP[j].date)

    if (date && date.getMonth() == i) {
      array.push(computedUserDP[j].dp)
    }
  }
  if (array.length === 0) array.push(0)

  let sum = 0
  for (let j = 0; j < array.length; j++) {
    sum = sum + array[j]
  }

  dpData.push(sum)
}

const data = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  datasets: [
    {
      label: 'Monthly DP',
      data: dpData,
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
  responsive: true
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