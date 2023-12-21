<script lang="ts" setup>
import {Avatar, EditPen, HomeFilled, MessageBox, UserFilled} from "@element-plus/icons-vue";
</script>

<template>
  <div id="admin">
    <div class="upper">
      <el-card>
        <el-icon :size="50">
          <MessageBox/>
        </el-icon>
        DP Logs
      </el-card>
      <el-card>
        <el-icon :size="50">
          <EditPen/>
        </el-icon>
        Modify Settings
      </el-card>
    </div>
    <div class="lower">
      <el-card>
        <el-icon :size="50">
          <UserFilled/>
        </el-icon>
        Modify Students
      </el-card>
      <el-card>
        <el-icon :size="50">
          <Avatar/>
        </el-icon>
        Modify Teachers
      </el-card>
      <el-card>
        <el-icon :size="50">
          <HomeFilled/>
        </el-icon>
        Modify Classes
      </el-card>
      <!--      <el-card>-->
      <!--        <el-icon :size="50"><Tools /></el-icon>-->
      <!--        Modify Data-->
      <!--      </el-card>-->
    </div>
  </div>
</template>

<style scoped>
#admin {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  user-select: none;
}

#admin :hover {
  box-shadow: 10px 10px 99px 6px rgba(76, 201, 240, 1);
}

.upper, .lower {
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

#admin :hover .el-card :deep(.el-card__body), #admin :hover .el-icon, #admin :hover svg {
  box-shadow: none;
}

.el-card {
  height: 100%;
  width: 100%;
  transform: scale(0.99);
  border: 2px solid #525457;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-icon {
  margin-bottom: 8px;
}

.el-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.el-card:hover {
  border: 3px solid #a6a9ad;
}
</style>