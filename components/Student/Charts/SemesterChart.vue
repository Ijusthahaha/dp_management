<script setup lang="ts">
import {Pie} from 'vue-chartjs'
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement} from 'chart.js'
import {useDPDataStore} from "~/composables/DPDataStore";
import {DPType} from "~/types/DPType";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const {computedUserDP} = useDPDataStore()
let DPTypeSet: DPType[] = []
const DPTypeArray: string[] = []

for (let i=0; i<computedUserDP.length; i++) {
  DPTypeSet.push(computedUserDP[i].type)
}

DPTypeSet = DPTypeSet.filter((item, index) => {
  return DPTypeSet.indexOf(item) === index
})

const DPTypeData: number[] = new Array(DPTypeSet.length).fill(0)

for (let i=0; i<DPTypeSet.length; i++) {
  DPTypeArray.push(Object.keys(DPType)[Object.values(DPType).indexOf(DPTypeSet[i])])
}

// contributor: jim
for (let i=0; i<computedUserDP.length; i++) {
  DPTypeData[DPTypeSet.indexOf(computedUserDP[i].type)] += computedUserDP[i].dp
}

const data = {
  labels: DPTypeArray,
  datasets: [
    {
      label: "Entire semester's DP",
      data: DPTypeData,
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
      // borderWidth: 1,
      hoverOffset: 4
    }
  ]
}

const chartOptions = {
  responsive: true,
  aspectRatio: 2
}
</script>

<template>
  <Pie
      :options="chartOptions"
      :data="data">
  </Pie>
</template>

<style scoped>

</style>