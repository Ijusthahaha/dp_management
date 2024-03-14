<script lang="ts" setup>
// show each student's dp.
import {Bar} from 'vue-chartjs'
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js'
import {useClassDPDataStore} from "~/composables/classDPDataStore";
import {storeToRefs} from "pinia";
import {getAllLogsByClass} from "~/utils/fetch";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const store = useClassDPDataStore()
const {classDP, isUpdatedDP} = storeToRefs(useClassDPDataStore())

const studentMap: Map<string, number> = new Map()
let update = ref(false)
const classMapKey = ref()
const classMapValue = ref()

getAllLogsByClass(useUserStore().jwt).then(data => {
  classDP.value = data.data.data
  isUpdatedDP.value = true
})

watch(isUpdatedDP, () => {
  for (let i = 0; i < classDP.value.length; i++) {
    // @ts-ignore
    let studentName = classDP.value[i].student_name
    let studentDP = classDP.value[i].dp

    if (!studentMap.has(studentName)) {
      studentMap.set(studentName, studentDP)
    } else {
      studentMap.set(studentName, studentMap.get(studentName) as number + studentDP)
    }
  }

  classMapKey.value = Array.from(studentMap.keys())
  classMapValue.value = Array.from(studentMap.values())
  update.value = true
})

const data = reactive({
  labels: classMapKey,
  datasets: [
    {
      label: "Student's DP",
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
      borderWidth: 1
    }
  ]
})

const chartOptions = {
  responsive: true,
  aspectRatio: 3
}
</script>

<template>
  <Bar
      v-if="update"
      :data="data"
      :options="chartOptions">
  </Bar>
</template>

<style scoped>

</style>