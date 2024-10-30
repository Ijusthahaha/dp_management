<script lang="ts" setup>
import {PolarArea} from 'vue-chartjs'
import {storeToRefs} from "pinia"
import {useClassDPDataStore} from "~/composables/classDPDataStore";
import {useDPDataStore} from "~/composables/DPDataStore";

const {isUpdatedDP, availableDP} = storeToRefs(useDPDataStore())
const update = ref(false)
const academicDP = ref(0)
const dormDP = ref(0)
watch(isUpdatedDP, () => {
  for (let i=0; i<availableDP.value.length; i++) {
    const location = availableDP.value[i].location
    if (location === "academic") {
      academicDP.value += availableDP.value[i].dp
    } else if (location === "dorm") {
      dormDP.value += availableDP.value[i].dp
    }
  }
  data.datasets[0].data = [academicDP.value, dormDP.value]
  update.value = true
})

const data = reactive({
  labels: ["Academic", "Dorm"],
  datasets: [
    {
      label: "Location",
      fill: true,
      data: [] as number[],
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      ticks: {
        backdropColor: 'transparent'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        lineWidth: 1,
      }
    }
  }
}

</script>

<template>
  <div class="chartContainer">
    <PolarArea
        v-if="update"
        :data="data"
        :options="chartOptions">
    </PolarArea>
  </div>
</template>

<style scoped>
.chartContainer {
  position: relative;
  height: calc(100% - 20px - 20px - 20px);
}
</style>