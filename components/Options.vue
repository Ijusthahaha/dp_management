<script setup lang="ts">
import {useUserStore} from "~/composables/userStore";
import {Chart} from "chart.js";

const {setLocale} = useI18n()
const store = useUserStore()

const updateTheme = (theme: string) => {
  store.$patch(state => {
    state.theme = theme
    if (theme === "light") {
      document.documentElement.classList.replace("dark", "light")
    } else {
      document.documentElement.classList.replace("light", "dark")
      Chart.defaults.color = "#E5EAF3"
    }
  })
}
const updateLanguage = (lang: string) => {
  store.$patch(state => {
    state.language = lang
    setLocale(lang)
  })
}
const updateFont = (font: string) => {
  store.$patch(state => {
    state.font = font
    if (font === "mc") {
      document.documentElement.style.setProperty('--font-family', 'Monocraft');
    } else {
      document.documentElement.style.setProperty('--font-family', "'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif");
    }
  })
}
</script>

<template>
  <div class="container">
    <div class="child">
      <button></button>
      <button @click="updateTheme('light')"></button>
      <button @click="updateTheme('dark')"></button>
    </div>
    <div class="child">
      <button></button>
      <button @click="updateLanguage('zh')"></button>
      <button @click="updateLanguage('en')"></button>
    </div>
    <!--MR.CLARENCE THINK THIS IS USELESS SO I HAVE TO REMOVED IT :(-->
<!--    <div class="child">-->
<!--      <button></button>-->
<!--      <button @click="updateFont('')"></button>-->
<!--      <button @click="updateFont('mc')"></button>-->
<!--    </div>-->
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
}
.container .child {
  position: fixed;
  transition: 0.5s;
  bottom: 16px;
  height: 56px;
  width: 56px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column-reverse;
  border: 3px solid white;
  background-color: #6b6d71;
  border-radius: 32px;
}
.container .child:nth-child(1) {
  right: 16px;
}
.container .child:nth-child(2) {
  right: calc(32px + 50px);
}
.container .child:nth-child(3) {
  right: calc(48px + 100px);
}
.container .child button {
  margin-top: 4px;
  margin-bottom: 4px;
  border-radius: 50%;
  cursor: pointer;
}
.container .child:nth-child(1) button:nth-child(1),
.container .child:nth-child(2) button:nth-child(1),
.container .child:nth-child(3) button:nth-child(1){
  width: 50px;
  height: 50px;
  background-color: #6b6d71;
  background-size: 36px 36px;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
}
.container .child:nth-child(1) button:nth-child(1) {
  background-image: url("/icons/colorpad.svg");
}
.container .child:nth-child(2) button:nth-child(1) {
  background-image: url("/icons/language.svg");
}
.container .child:nth-child(3) button:nth-child(1) {
  background-image: url("/icons/font.svg");
}
.container .child:nth-child(1) button:not(:nth-child(1)),
.container .child:nth-child(2) button:not(:nth-child(1)),
.container .child:nth-child(3) button:not(:nth-child(1)){
  width: 36px;
  height: 36px;
  border: 2px solid white;
  overflow: hidden;
  display: none;
}
.container .child:nth-child(1) button:nth-child(2) {
  border: 2px solid #303030;
  background-color: #e5eaf3;
}
.container .child:nth-child(1) button:nth-child(3) {
  border: 2px solid #e5eaf3;
  background-color: #303030;
}

.container .child:nth-child(1):hover,
.container .child:nth-child(2):hover,
.container .child:nth-child(3):hover{
  height: 180px;
}
.container .child:nth-child(1):hover button,
.container .child:nth-child(2):hover button,
.container .child:nth-child(3):hover button{
  display: block;
}
.container .child:nth-child(2) button,
.container .child:nth-child(3) button{
  font-size: 0.9rem;
  font-weight: bold;
}
.container .child:nth-child(2) button:nth-child(2)::before {
  content: '中';
}
.container .child:nth-child(2) button:nth-child(3)::before {
  content: 'Eng';
}
.container .child:nth-child(3) button:nth-child(2)::before {
  content: '宋';
}
.container .child:nth-child(3) button:nth-child(3)::before {
  content: 'MC';
}
</style>