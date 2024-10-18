<script lang="ts" setup>
import ClassChart from "~/components/Teacher/Charts/School/ClassChart.vue";
import TypeChart from "~/components/Teacher/Charts/School/TypeChart.vue";
import StudentLevelChart from "~/components/Teacher/Charts/School/StudentLevelChart.vue";
</script>

<template>
  <el-carousel :autoplay="false" trigger="click">
    <el-carousel-item>
      <el-card shadow="hover" :body-style="{height:'100%', width:'100%', boxSizing:'border-box'}">
        <template #header>
          <div>
            <span>{{$t('teacher.school.class_dp')}}</span>
          </div>
        </template>
        <div class="mainCard">
          <ClassChart></ClassChart>
        </div>
      </el-card>
    </el-carousel-item>
    <el-carousel-item>
      <el-card shadow="hover" :body-style="{height:'100%', width:'100%', boxSizing:'border-box'}">
        <template #header>
          <div>
            <span>{{$t('teacher.school.dp_type')}}</span>
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
            <span>{{$t('teacher.school.divisions')}}</span>
          </div>
        </template>
        <div class="mainCard">
          <StudentLevelChart></StudentLevelChart>
        </div>
      </el-card>
    </el-carousel-item>
  </el-carousel>
</template>

<style scoped>
.el-carousel, .el-carousel__item, .el-carousel__container {
  height: 100% !important;
}

::v-deep(.el-carousel) .el-carousel__container {
  height: 100% !important;
}

.el-card, .mainCard  {
  height: 100%;
}
</style>