<script lang="ts" setup>
import {Line} from 'vue-chartjs'
import {Chart as ChartJS, registerables} from 'chart.js'
import {useClassDPDataStore} from "~/composables/classDPDataStore";

ChartJS.register(...registerables)

const store = useClassDPDataStore()
const MONTHS = [
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
]

const dpMap: Map<string, number> = new Map()
for (let i = 0; i < MONTHS.length; i++) {
  dpMap.set(MONTHS[i], 0)
}

for (let i = 0; i < store.classDP.length; i++) {
  let date = new Date(+store.classDP[i].date)
  let dp = store.classDP[i].dp

  dpMap.set(MONTHS[date.getMonth()], dpMap.get(MONTHS[date.getMonth()]) as number + dp)
}

const data = {
  labels: MONTHS,
  datasets: [
    {
      label: "Average DP",
      data: Array.from(dpMap.values()),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderWidth: 1,
      pointStyle: 'circle',
      pointRadius: 10,
      pointHoverRadius: 15
    }
  ]
}
const chartOptions = {
  responsive: true,
  aspectRatio: 3
}
</script>

<template>
  <Line :data="data"
        :options="chartOptions"></Line>
</template>

<style scoped>

</style>