<script setup lang="ts">
import {Radar} from 'vue-chartjs'
import {Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PolarAreaController, RadialLinearScale, PointElement, LineElement, ArcElement, Filler} from 'chart.js'
import {useDPDataStore} from "~/composables/DPDataStore";
import {DPType} from "~/types/DPType";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PolarAreaController, RadialLinearScale, PointElement, LineElement, ArcElement, Filler)

const {computedUserDP, averageDP} = useDPDataStore()

let DPTypeSet: DPType[] = []
const DPTypeArray: string[] = []

for (let i=0; i<computedUserDP.length; i++) {
  DPTypeSet.push(computedUserDP[i].type)
}

DPTypeSet = DPTypeSet.filter((item, index) => {
  return DPTypeSet.indexOf(item) === index
})

for (let i=0; i<DPTypeSet.length; i++) {
  DPTypeArray.push(Object.keys(DPType)[Object.values(DPType).indexOf(DPTypeSet[i])])
}

const DPTypeData: number[] = new Array(DPTypeSet.length).fill(0)

// contributor: jim
for (let i=0; i<computedUserDP.length; i++) {
  DPTypeData[DPTypeSet.indexOf(computedUserDP[i].type)] += computedUserDP[i].dp
}

const data = {
  labels: DPTypeArray,
  datasets: [
    {
      label: "Personal DP",
      fill: true,
      data: DPTypeData,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(54, 162, 235)'
    },
    {
      label: "Average DP",
      fill: true,
      data: averageDP,
      backgroundColor:  'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)',
    }
  ]
}

const chartOptions = {
  responsive: true,
  aspectRatio: 2
}
</script>

<template>
  <Radar
      :options="chartOptions"
      :data="data">
  </Radar>
</template>

<style scoped>

</style>