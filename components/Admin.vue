<script lang="ts" setup>
import HeaderNavigator from "~/components/Admin/HeaderNavigator.vue";
import LeftNavigators from "~/components/Admin/LeftNavigators.vue";
import MainNavigator from "~/components/Admin/MainNavigator.vue";
</script>

<template>
  <div id="admin">
    <el-container class="h-full">
      <el-header>
        <HeaderNavigator></HeaderNavigator>
      </el-header>
      <el-container class="h-full">
        <el-aside width="210px">
          <LeftNavigators></LeftNavigators>
        </el-aside>
        <el-main>
          <MainNavigator></MainNavigator>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
#admin {
  height: 100vh;
  width: 100vw;
  user-select: none;
}
</style>

<style>
.el-container, .el-scrollbar__view, .el-menu {
  height: 100%;
}
</style>