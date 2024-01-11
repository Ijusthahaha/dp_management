<script lang="ts" setup>
import {Pie} from "vue-chartjs";
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js'
import {useClassDPDataStore} from "~/composables/classDPDataStore";
import {DPType} from "~/types/DPType";
import {storeToRefs} from "pinia";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const store = useClassDPDataStore()
const {classDP, isUpdatedDP} = storeToRefs(useClassDPDataStore())

const typeMap: Map<string, number> = new Map()
let update = ref(false)
const classMapKey = ref()
const classMapValue = ref()

watch(isUpdatedDP, () => {
  for (let i = 0; i < classDP.value.length; i++) {
    let dpType = Object.keys(DPType).filter(v => isNaN(Number(v)))[Object.values(DPType).indexOf(classDP.value[i].log_type)]
    let studentDP = classDP.value[i].dp

    if (!typeMap.has(dpType)) {
      typeMap.set(dpType, studentDP)
    } else {
      typeMap.set(dpType, typeMap.get(dpType) as number + studentDP)
    }
  }

  classMapKey.value = Array.from(typeMap.keys())
  classMapValue.value = Array.from(typeMap.values())
  update.value = true
})

const data = reactive({
  labels: classMapKey,
  datasets: [
    {
      label: "DP",
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
      // borderWidth: 1,
      hoverOffset: 4
    }
  ]
})

const chartOptions = {
  responsive: true,
  aspectRatio: 3
}
</script>

<template>
  <Pie
      v-if="update"
      :data="data"
      :options="chartOptions">
  </Pie>
</template>

<style scoped>

</style>