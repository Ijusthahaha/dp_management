<script lang="ts" setup>
import {Pie} from 'vue-chartjs'
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js'
import {useDPDataStore} from "~/composables/DPDataStore";
import {DPType} from "~/types/DPType";
import {storeToRefs} from "pinia";
import {Ref} from "@vue/reactivity";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const {isUpdatedDP, computedUserDP} = storeToRefs(useDPDataStore())

const DPTypeSet: Ref<DPType[]> = ref([])
const DPTypeArray: Ref<string[]> = ref([])
const DPTypeData: Ref<number[]> = ref([])
const update = ref(false)

const data = reactive({
  labels: DPTypeArray,
  datasets: [
    {
      label: "Entire semester's DP",
      data: DPTypeData.value,
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

  DPTypeData.value = new Array(DPTypeSet.value.length).fill(0)
  for (let i = 0; i < DPTypeSet.value.length; i++) {
    DPTypeArray.value.push(Object.keys(DPType)[Object.values(DPType).indexOf(DPTypeSet.value[i])])
  }

  // contributor: jim
  for (let i = 0; i < computedUserDP.value.length; i++) {
    DPTypeData.value[DPTypeSet.value.indexOf(computedUserDP.value[i].type)] += computedUserDP.value[i].dp
  }

  data.datasets[0].data = DPTypeData.value
  data.labels = DPTypeArray.value

  update.value = true
})

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