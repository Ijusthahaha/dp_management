<script lang="ts" setup>
import {Bar} from 'vue-chartjs'
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js'
import {useDPDataStore} from "~/composables/DPDataStore";
import {type Ref} from "@vue/reactivity";
import {storeToRefs} from "pinia";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const {isUpdatedDP, availableDP} = storeToRefs(useDPDataStore())

let dpData: Ref<number[]> = ref([])

let data = reactive({
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
      data: dpData.value,
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
})
const chartOptions = {
  responsive: true
}

const update = ref(false)
watch(isUpdatedDP, () => {
  let d = []
  for (let i = 0; i < 12; i++) {
    let array: number[] = []

    for (let j = 0; j < availableDP.value.length; j++) {
      let date = new Date(availableDP.value[j].date)

      if (date && date.getMonth() == i) {
        array.push(availableDP.value[j].dp)
      }
    }
    if (array.length === 0) array.push(0)

    let sum = 0
    for (let j = 0; j < array.length; j++) {
      sum = sum + array[j]
    }

    d.push(sum)
  }
  dpData.value = d
  data.datasets[0].data = d
  update.value = true
})

</script>

<template>
  <Bar v-if="update"
       :data="data"
       :options="chartOptions">
  </Bar>
</template>

<style scoped>

</style>