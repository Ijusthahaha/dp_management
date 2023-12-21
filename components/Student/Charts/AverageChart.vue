<script lang="ts" setup>
import {Radar} from 'vue-chartjs'
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  PolarAreaController,
  RadialLinearScale,
  Title,
  Tooltip
} from 'chart.js'
import {useDPDataStore} from "~/composables/DPDataStore";
import {DPType} from "~/types/DPType";
import {Ref} from "@vue/reactivity";
import {storeToRefs} from "pinia";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PolarAreaController, RadialLinearScale, PointElement, LineElement, ArcElement, Filler)

const {isUpdatedDP, averageDP, computedUserDP} = storeToRefs(useDPDataStore())

const DPTypeSet: Ref<DPType[]> = ref([])
const DPTypeArray: Ref<string[]> = ref([])
const DPTypeData: Ref<number[]> = ref([])
const fetchedAverageDP: Ref<number[]> = ref([])
const update = ref(0)

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
  aspectRatio: 2
}

watch(isUpdatedDP, () => {
  DPTypeSet.value.length = 0
  DPTypeArray.value.length = 0
  DPTypeData.value.length = 0

  for (let i = 0; i < computedUserDP.value.length; i++) {
    DPTypeSet.value.push(computedUserDP.value[i].type)
  }

  DPTypeSet.value = DPTypeSet.value.filter((item, index) => {
    return DPTypeSet.value.indexOf(item) === index
  })

  for (let i = 0; i < DPTypeSet.value.length; i++) {
    DPTypeArray.value.push(Object.keys(DPType)[Object.values(DPType).indexOf(DPTypeSet.value[i])])
  }

  DPTypeData.value = new Array(DPTypeSet.value.length).fill(0)

  // contributor: jim
  for (let i = 0; i < computedUserDP.value.length; i++) {
    DPTypeData.value[DPTypeSet.value.indexOf(computedUserDP.value[i].type)] += computedUserDP.value[i].dp
  }

  data.datasets[0].data = DPTypeData.value
  data.labels = DPTypeArray.value

  update.value++
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

  update.value++
}, {immediate: true})
</script>

<template>
  <Radar
      v-if="update >= 3"
      :data="data"
      :options="chartOptions">
  </Radar>
</template>

<style scoped>

</style>