<script lang="ts" setup>
import {Bar} from 'vue-chartjs'
import {useDPDataStore} from "~/composables/DPDataStore";
import {type Ref} from "@vue/reactivity";
import {storeToRefs} from "pinia";

const {isUpdatedDP, availableDP} = storeToRefs(useDPDataStore())

let dpData: Ref<number[]> = ref([])

let data = reactive({
  labels: [
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August'
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
  responsive: true,
  maintainAspectRatio: false
}

const update = ref(false)
watch(isUpdatedDP, () => {
  let d = []
  const semesterMonths = [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7]; // begin with 9th, "8" represents 9th
  for (let i = 0; i < 12; i++) {
    let month = semesterMonths[i];
    let monthlyDemeritPoints: number[] = [];

    for (let j = 0; j < availableDP.value.length; j++) {
      let date = new Date(availableDP.value[j].date)

      if (date && date.getMonth() == month) {
        monthlyDemeritPoints.push(availableDP.value[j].dp)
      }
    }
    if (monthlyDemeritPoints.length === 0) monthlyDemeritPoints.push(0)

    let sum = monthlyDemeritPoints.reduce((total, dp) => total + dp, 0);
    d.push(sum);
  }
  dpData.value = d
  data.datasets[0].data = d
  update.value = true
})

</script>

<template>
  <div class="chartContainer">
    <Bar v-if="update"
         :data="data"
         :options="chartOptions">
    </Bar>
  </div>
</template>

<style scoped>
.chartContainer {
  position: relative;
  /* 20px for el-card upper padding, 20px for el-card lower padding, 20px for this padding */
  height: calc(100% - 20px - 20px - 20px);
}
</style>