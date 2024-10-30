<script lang="ts" setup>
import AverageChart from "~/components/Teacher/Charts/Class/AverageChart.vue";
import StudentChart from "~/components/Teacher/Charts/Class/StudentChart.vue";
import TypeChart from "~/components/Teacher/Charts/Class/TypeChart.vue";
import {useUserStore} from "~/composables/userStore";
import type {Teacher} from "~/types/User";
import LocationChart from "~/components/Teacher/Charts/Class/LocationChart.vue";

const store = useUserStore()
</script>

<template>
  <el-carousel :autoplay="false" trigger="click" v-if="(store.user as Teacher).clazz">
    <el-carousel-item>
      <el-card shadow="hover" :body-style="{height:'100%', width:'100%', boxSizing:'border-box'}">
        <template #header>
          <div>
            <span>{{$t('teacher.class.student_dp')}}</span>
          </div>
        </template>
        <div class="mainCard">
          <StudentChart></StudentChart>
        </div>
      </el-card>
    </el-carousel-item>
    <el-carousel-item>
      <el-card shadow="hover" :body-style="{height:'100%', width:'100%', boxSizing:'border-box'}">
        <template #header>
          <div>
            <span>{{$t('teacher.class.average_dp')}}</span>
          </div>
        </template>
        <div class="mainCard">
          <AverageChart></AverageChart>
        </div>
      </el-card>
    </el-carousel-item>
    <el-carousel-item>
      <el-card shadow="hover" :body-style="{height:'100%', width:'100%', boxSizing:'border-box'}">
        <template #header>
          <div>
            <span>{{$t('teacher.class.dp_type')}}</span>
          </div>
        </template>
        <div class="mainCard">
          <TypeChart></TypeChart>
        </div>
      </el-card>
    </el-carousel-item>
    <el-carousel-item>
      <el-card shadow="hover" :body-style="{height:'100%', width:'100%', boxSizing:'border-box'}">
        <template #header>
          <div>
            <span>{{$t('teacher.class.location_dp')}}</span>
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
.el-carousel, .el-carousel__item, .el-carousel__container {
  height: 100% !important;
}

::v-deep(.el-carousel) .el-carousel__container {
  height: 100% !important;
}

.el-card, .mainCard {
  height: 100%;
}
</style>