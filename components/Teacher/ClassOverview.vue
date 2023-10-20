<script setup lang="ts">
import AverageChart from "~/components/Teacher/Charts/Class/AverageChart.vue";
import StudentChart from "~/components/Teacher/Charts/Class/StudentChart.vue";
import TypeChart from "~/components/Teacher/Charts/Class/TypeChart.vue";
import CompareChart from "~/components/Teacher/Charts/Class/CompareChart.vue";
</script>

<template>
  <el-carousel trigger="click" :autoplay="false">
    <el-carousel-item>
      <el-card shadow="hover">
        <template #header>
          <div>
            <span>Students' DP</span>
          </div>
        </template>
        <div class="mainCard">
          <StudentChart></StudentChart>
        </div>
      </el-card>
    </el-carousel-item>
    <el-carousel-item>
      <el-card shadow="hover">
        <template #header>
          <div>
            <span>Students' Average DP</span>
          </div>
        </template>
        <div class="mainCard">
          <AverageChart></AverageChart>
        </div>
      </el-card>
    </el-carousel-item>
    <el-carousel-item>
      <el-card shadow="hover">
        <template #header>
          <div>
            <span>DP Type</span>
          </div>
        </template>
        <div class="mainCard">
          <TypeChart></TypeChart>
        </div>
      </el-card>
    </el-carousel-item>
<!--    <el-carousel-item>-->
<!--      <el-card shadow="hover">-->
<!--        <template #header>-->
<!--          <div>-->
<!--            <span>Compare with other classes</span>-->
<!--          </div>-->
<!--        </template>-->
<!--        <div class="mainCard">-->
<!--          <CompareChart></CompareChart>-->
<!--        </div>-->
<!--      </el-card>-->
<!--    </el-carousel-item>-->
  </el-carousel>
</template>

<style scoped>
.el-carousel, .el-carousel__item, .el-carousel__container {
  height: 100% !important;
}

::v-deep(.el-carousel) .el-carousel__container {
  height: 100% !important;
}

.el-card {
  height: 100%;
}
</style>