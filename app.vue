<template>
  <client-only>
    <div id="app">
      <NuxtPage />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import {useUserStore} from "~/composables/userStore";

const store = useUserStore()
onMounted(() => {
  if (store.theme == 'dark') {
    document.documentElement.classList.add("dark")
  }

  if (store.font == "minecraft" || store.font == "mc") {
    document.documentElement.style.setProperty('--font-family', 'Monocraft');
  }
})
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>