<script setup lang="ts">

</script>

<template>
  <div class="container">
    <div class="containerThatFloatsLeft">
      <img id="imImgId" src="/favicon.svg" alt="favicon"/>
      <div class="holyTitle" style="font-size: var(--el-font-size-extra-large)">
        School DP Management System
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #4C4D4F;
}

#imImgId {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px;
}

.holyTitle {
  border: 2px solid #66b1ff;
  border-radius: 8px;
  padding: 4px 8px 4px 8px;
}

.containerThatFloatsLeft {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>