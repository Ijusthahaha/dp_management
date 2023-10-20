<script setup lang="ts">

import MonthlyChart from "~/components/Student/Charts/MonthlyChart.vue";
import AverageChart from "~/components/Student/Charts/AverageChart.vue";
import SemesterChart from "~/components/Student/Charts/SemesterChart.vue";
</script>

<template>
  <el-carousel trigger="click" :autoplay="false">
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
