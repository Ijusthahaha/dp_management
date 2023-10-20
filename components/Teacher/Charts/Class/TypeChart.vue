<script setup lang="ts">
import {Pie} from "vue-chartjs";
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement} from 'chart.js'
import {useClassDPDataStore} from "~/composables/classDPDataStore";
import {DPType} from "~/types/DPType";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const store = useClassDPDataStore()

const typeMap: Map<string, number> = new Map()


let DPTypeSet: DPType[] = []
const DPTypeArray: string[] = []

for (let i=0; i<store.classDP.length; i++) {
  DPTypeSet.push(store.classDP[i].type)
}

DPTypeSet = DPTypeSet.filter((item, index) => {
  return DPTypeSet.indexOf(item) === index
})

for (let i=0; i<DPTypeSet.length; i++) {
  DPTypeArray.push(Object.keys(DPType)[Object.values(DPType).indexOf(DPTypeSet[i])])
}

for (let i=0; i<store.classDP.length; i++) {
  let dpType = Object.keys(DPType)[Object.values(DPType).indexOf(store.classDP[i].type)]
  let studentDP = store.classDP[i].dp

  if (!typeMap.has(dpType)) {
    typeMap.set(dpType, studentDP)
  } else {
    typeMap.set(dpType, typeMap.get(dpType) as number + studentDP)
  }
}

const data = {
  labels: Array.from(typeMap.keys()),
  datasets: [
    {
      label: "DP",
      data: Array.from(typeMap.values()),
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
  aspectRatio: 3
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