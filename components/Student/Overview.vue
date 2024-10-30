<script lang="ts" setup>
import MonthlyChart from "~/components/Student/Charts/MonthlyChart.vue";
import AverageChart from "~/components/Student/Charts/AverageChart.vue";
import SemesterChart from "~/components/Student/Charts/SemesterChart.vue";
import {storeToRefs} from "pinia";
import {useDPDataStore} from "~/composables/DPDataStore";
import LocationChart from "~/components/Student/Charts/LocationChart.vue";

const {isUpdatedDP, rawUserDP} = storeToRefs(useDPDataStore())
const isComputedUserDPEmpty = ref(false)
watch(isUpdatedDP, () => {
  if (rawUserDP.value.length === 0) {
    isComputedUserDPEmpty.value = true
  }
})
</script>

<template>
  <el-carousel v-if="!isComputedUserDPEmpty" :autoplay="false" trigger="click">
    <el-carousel-item>
      <el-card :body-style="{height:'100%', width:'100%', boxSizing:'border-box'}" shadow="hover">
        <template #header>
          <div>
            <span>{{ $t('student.menu.overview.monthly') }}</span>
          </div>
        </template>
        <div class="mainCard">
          <MonthlyChart></MonthlyChart>
        </div>
      </el-card>
    </el-carousel-item>
    <el-carousel-item>
      <el-card :body-style="{height:'100%', width:'100%', boxSizing:'border-box'}" shadow="hover">
        <template #header>
          <div>
            <span>{{ $t('student.menu.overview.semester') }}</span>
          </div>
        </template>
        <div class="mainCard">
          <SemesterChart></SemesterChart>
        </div>
      </el-card>
    </el-carousel-item>
    <el-carousel-item>
      <el-card :body-style="{height:'100%', width:'100%', boxSizing:'border-box'}" shadow="hover">
        <template #header>
          <div>
            <span>{{ $t('student.menu.overview.compare') }}</span>
          </div>
        </template>
        <div class="mainCard">
          <AverageChart></AverageChart>
        </div>
      </el-card>
    </el-carousel-item>
    <el-carousel-item>
      <el-card :body-style="{height:'100%', width:'100%', boxSizing:'border-box'}" shadow="hover">
        <template #header>
          <div>
            <span>{{ $t('student.menu.overview.location_dp') }}</span>
          </div>
        </template>
        <div class="mainCard">
          <LocationChart></LocationChart>
        </div>
      </el-card>
    </el-carousel-item>
  </el-carousel>
  <el-empty v-else></el-empty>
</template>

<style scoped>
.el-card, .mainCard {
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
