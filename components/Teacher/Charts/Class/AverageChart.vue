<script lang="ts" setup>
import {Line} from 'vue-chartjs'
import {Chart as ChartJS, registerables} from 'chart.js'
import {useClassDPDataStore} from "~/composables/classDPDataStore";
import {storeToRefs} from "pinia";

ChartJS.register(...registerables)

const store = useClassDPDataStore()
const {classDP, isUpdatedDP} = storeToRefs(useClassDPDataStore())
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
let update = ref(false)
const classMapValue = ref()

watch(isUpdatedDP, () => {
  for (let i = 0; i < MONTHS.length; i++) {
    dpMap.set(MONTHS[i], 0)
  }

  for (let i = 0; i < classDP.value.length; i++) {
    let date = new Date(classDP.value[i].date)
    let dp = classDP.value[i].dp

    dpMap.set(MONTHS[date.getMonth()], dpMap.get(MONTHS[date.getMonth()]) as number + dp)
  }
  classMapValue.value = Array.from(dpMap.values())
  update.value = true
})

const data = reactive({
  labels: MONTHS,
  datasets: [
    {
      label: "Average DP",
      data: classMapValue,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderWidth: 1,
      pointStyle: 'circle',
      pointRadius: 10,
      pointHoverRadius: 15
    }
  ]
})

const chartOptions = {
  responsive: true,
  aspectRatio: 3
}
</script>

<template>
  <Line
      v-if="update"
      :data="data"
      :options="chartOptions">
  </Line>
</template>

<style scoped>

</style>