<script lang="ts" setup>
import {Radar} from 'vue-chartjs'
import {useDPDataStore} from "~/composables/DPDataStore";
import {DPType} from "~/types/DPType";
import {type Ref} from "@vue/reactivity";
import {storeToRefs} from "pinia";
const {isUpdatedDP, averageDP, availableDP} = storeToRefs(useDPDataStore())

const DPTypeSet: Ref<DPType[]> = ref([])
const DPTypeArray: Ref<string[]> = ref([])
const DPTypeData: Ref<number[]> = ref([])
const fetchedAverageDP: Ref<number[]> = ref([])

const updateTheDP = ref(false)
const updateAverageDP = ref(false)

const data = reactive({
  labels: DPTypeArray,
  datasets: [
    {
      label: "Personal DP",
      fill: true,
      data: DPTypeData.value,
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
      data: fetchedAverageDP.value,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)',
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

watch(isUpdatedDP, () => {
  DPTypeSet.value.length = 0
  DPTypeArray.value.length = 0
  DPTypeData.value.length = 0

  for (let i = 0; i < availableDP.value.length; i++) {
    DPTypeSet.value.push(availableDP.value[i].type)
  }

  DPTypeSet.value = DPTypeSet.value.filter((item, index) => {
    return DPTypeSet.value.indexOf(item) === index
  })

  for (let i = 0; i < DPTypeSet.value.length; i++) {
    DPTypeArray.value.push(Object.keys(DPType)[Object.values(DPType).indexOf(DPTypeSet.value[i])])
  }

  DPTypeData.value = new Array(DPTypeSet.value.length).fill(0)

  // contributor: jim
  for (let i = 0; i < availableDP.value.length; i++) {
    DPTypeData.value[DPTypeSet.value.indexOf(availableDP.value[i].type)] += availableDP.value[i].dp
  }

  data.datasets[0].data = DPTypeData.value
  data.labels = DPTypeArray.value

  updateTheDP.value = true
})

watch(averageDP, () => {
  fetchedAverageDP.value.length = 0
  const d = []

  for (let i = 0; i < DPTypeArray.value.length; i++) {
    for (let j = 0; j < averageDP.value.length; j++) {
      if (DPTypeArray.value[i] === averageDP.value[j].logName) {
        // fetchedAverageDP.value.push(averageDP.value[j].logDP)
        d.push(averageDP.value[j].logDP)
      }
    }
  }

  fetchedAverageDP.value = d
  data.datasets[1].data = d

  updateAverageDP.value = true
})
</script>

<template>
  <div class="chartContainer">
    <Radar
        v-if="updateTheDP && updateAverageDP"
        :data="data"
        :options="chartOptions">
    </Radar>
  </div>
</template>

<style scoped>
.chartContainer {
  position: relative;
  /* 20px for el-card upper padding, 20px for el-card lower padding, 20px for this padding */
  height: calc(100% - 20px - 20px - 20px);
}
</style>