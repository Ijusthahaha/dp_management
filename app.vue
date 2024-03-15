<template>
  <client-only>
    <div id="app">
      <NuxtPage/>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
import {useUserStore} from "~/composables/userStore";
import {Chart} from "chart.js";

const {setLocale} = useI18n()

const store = useUserStore()
onMounted(() => {
  setLocale(store.language)
  if (store.theme == 'light') {
    // document.body.style.backgroundColor = "#F2F3F5"

    // i don't care about light mode. light = dark idc
    document.documentElement.classList.add("dark")
    Chart.defaults.color = "#E5EAF3"
  } else {
    document.documentElement.classList.add("dark")
    Chart.defaults.color = "#E5EAF3"
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