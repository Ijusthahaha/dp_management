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
    document.documentElement.classList.add("light")
  } else {
    document.documentElement.classList.add("dark")
    Chart.defaults.color = "#E5EAF3"
  }

  if (store.font == "minecraft" || store.font == "mc") {
    document.documentElement.style.setProperty('--font-family', 'Monocraft');
  }

  // for debug
  window.addEventListener("keydown", (key) => {
    if (key.key === "F9") {
      store.$patch(state => {
        state.jwt = ''
        localStorage.setItem("JWT", '')
        location.reload()
      })
    }
  })
})
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>