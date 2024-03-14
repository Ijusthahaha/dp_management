<script lang="ts" setup>
import {Avatar, HomeFilled, Location, MessageBox, Setting, TrophyBase, UserFilled} from "@element-plus/icons-vue";
import {useAdminDataStore} from "~/composables/adminDataStore";
import {storeToRefs} from "pinia";

const {activeRouteIndex} = storeToRefs(useAdminDataStore())
const setCurrentRoute = function (index: string) {
  activeRouteIndex.value = index
}

</script>

<template>
  <el-menu :default-active="activeRouteIndex" @select="setCurrentRoute">
    <el-menu-item index="Dashboard">
      <template #title>
        <el-icon>
          <location/>
        </el-icon>
        <span>Dashboard</span>
      </template>
    </el-menu-item>
    <el-menu-item index="Student">
      <template #title>
        <el-icon>
          <UserFilled/>
        </el-icon>
        <span>Manage Students</span>
      </template>
    </el-menu-item>
    <el-menu-item index="Teacher">
      <template #title>
        <el-icon>
          <Avatar/>
        </el-icon>
        <span>Manage Teachers</span>
      </template>
    </el-menu-item>
    <el-menu-item index="Class">
      <template #title>
        <el-icon>
          <HomeFilled/>
        </el-icon>
        <span>Manage Classes</span>
      </template>
    </el-menu-item>
    <el-menu-item index="Log">
      <template #title>
        <el-icon>
          <MessageBox/>
        </el-icon>
        <span>Logs</span>
      </template>
    </el-menu-item>
    <el-menu-item index="Leaderboard">
      <template #title>
        <el-icon>
          <TrophyBase/>
        </el-icon>
        <span>Leaderboard</span>
      </template>
    </el-menu-item>
    <el-menu-item index="Setting">
      <template #title>
        <el-icon>
          <Setting/>
        </el-icon>
        <span>Settings</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>

</style>