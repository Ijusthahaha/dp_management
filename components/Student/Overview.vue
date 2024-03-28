<script lang="ts" setup>
import MonthlyChart from "~/components/Student/Charts/MonthlyChart.vue";
import AverageChart from "~/components/Student/Charts/AverageChart.vue";
import SemesterChart from "~/components/Student/Charts/SemesterChart.vue";
import {storeToRefs} from "pinia";
import {useDPDataStore} from "~/composables/DPDataStore";

const {isUpdatedDP, computedUserDP} = storeToRefs(useDPDataStore())
const isComputedUserDPEmpty = ref(false)
watch(isUpdatedDP, () => {
  if (computedUserDP.value.length === 0) {
    isComputedUserDPEmpty.value = true
  }
})
</script>

<template>
  <el-carousel v-if="!isComputedUserDPEmpty" :autoplay="false" trigger="click">
    <el-carousel-item>
      <el-card shadow="hover">
        <template #header>
          <div>
            <span>Monthly DP</span>
          </div>
        </template>
        <div class="mainCard">
          <MonthlyChart></MonthlyChart>
        </div>
      </el-card>
    </el-carousel-item>
    <el-carousel-item>
      <el-card shadow="hover">
        <template #header>
          <div>
            <span>Entire semester's DP</span>
          </div>
        </template>
        <div class="mainCard">
          <SemesterChart></SemesterChart>
        </div>
      </el-card>
    </el-carousel-item>
    <el-carousel-item>
      <el-card shadow="hover">
        <template #header>
          <div>
            <span>Compare with average DP</span>
          </div>
        </template>
        <div class="mainCard">
          <AverageChart></AverageChart>
        </div>
      </el-card>
    </el-carousel-item>
  </el-carousel>
  <el-empty v-else></el-empty>
</template>

<style scoped>
.el-card {
  height: 100%;
}
</style>

<style>
.el-carousel, .el-carousel__item, .el-carousel__container {
  height: 100% !important;
}

::v-deep(.el-carousel) .el-carousel__container {
  height: 100% !important;
}
</style>
