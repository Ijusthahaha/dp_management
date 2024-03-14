<script lang="ts" setup>
import {storeToRefs} from "pinia";
import {useAdminDataStore} from "~/composables/adminDataStore";
import {
  AdminModulesClass,
  AdminModulesDashboard,
  AdminModulesLog,
  AdminModulesSetting,
  AdminModulesStudent,
  AdminModulesTeacher
} from "#components"
import type {DefineComponent, ShallowRef} from "vue";

const {activeRouteIndex} = storeToRefs(useAdminDataStore())
const currentRouteIndex: ShallowRef<DefineComponent<{}, {}, any>> = shallowRef(AdminModulesDashboard)

watch(activeRouteIndex, (newValue) => {
  if (newValue === "Dashboard") {
    currentRouteIndex.value = AdminModulesDashboard
  } else if (newValue === "Student") {
    currentRouteIndex.value = AdminModulesStudent
  } else if (newValue === "Teacher") {
    currentRouteIndex.value = AdminModulesTeacher
  } else if (newValue === "Class") {
    currentRouteIndex.value = AdminModulesClass
  } else if (newValue === "Log") {
    currentRouteIndex.value = AdminModulesLog
  } else if (newValue === "Setting") {
    currentRouteIndex.value = AdminModulesSetting
  }
}, {immediate: true})

const particlesOptions = {
  fullScreen: {
    enable: false,
    zIndex: -1
  },
  background: {
    color: {
      value: 'transparent'
    }
  },
  particles: {
    color: {
      value: "rgb(119, 119, 119)"
    },
    links: {
      color: "rgb(119, 119, 119)",
      enable: true
    },
    move: {
      enable: true,
      "speed": 0.2
    },
    number: {
      value: 50
    },
    interactivity: {
      detect_on: 'window'
    },
    autoplay: true,
    fpsLimit: 30
  }
}
</script>

<template>
  <div class="container" style="position: relative;">
    <NuxtParticles id="tsparticles" :options="particlesOptions"
                   class="container">
    </NuxtParticles>
    <component :is="currentRouteIndex" class="container component"/>
  </div>
</template>

<style scoped>
#tsparticles {
  position: absolute;
  inset: 0;
}

.container {
  height: 100%;
  width: 100%;
}

.component {
  position: absolute;
  padding: 10px;
  z-index: 10;
}
</style>