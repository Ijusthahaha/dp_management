<script lang="ts" setup>
import {Line} from 'vue-chartjs'
import {useClassDPDataStore} from "~/composables/classDPDataStore";
import {storeToRefs} from "pinia";
const store = useClassDPDataStore()
const {classDP, isUpdatedDP} = storeToRefs(useClassDPDataStore())
const MONTHS = [
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
];

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
    let monthIndex = (date.getMonth() + 4) % 12
    dpMap.set(MONTHS[monthIndex], (dpMap.get(MONTHS[monthIndex]) as number) + dp);
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
  maintainAspectRatio: false
}
</script>

<template>
  <div class="chartContainer">
    <Line
        v-if="update"
        :data="data"
        :options="chartOptions">
    </Line>
  </div>
</template>

<style scoped>
.chartContainer {
  position: relative;
  height: calc(100% - 20px - 20px - 20px);
}
</style>