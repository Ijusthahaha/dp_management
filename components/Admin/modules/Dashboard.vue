<script lang="ts" setup>
import {Avatar, CaretBottom, CaretTop, ChatLineRound, HomeFilled, UserFilled,} from '@element-plus/icons-vue'
import {Line} from 'vue-chartjs'
import {getAdminDashboardData} from "~/utils/fetch";

const sourceOfTotalDPCount = ref(0)
const TotalDPCount = useTransition(sourceOfTotalDPCount, {
  duration: 3000,
})

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const data = {
  labels: MONTHS,
  datasets: [{
    label: 'Monthly DP',
    data: [3, 6, 8, 1, 2, 9, 3, 5, 6, 9, 4, 5],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    // tension: 0.1
  }]
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
  },
  scales: {
    // x: {display: false},
    // y: {
    //   ticks: {
    //     beginAtZero: true,
    //   },
    //   display: false
    // }
  },
}

let counts = reactive({
  student: 0,
  teacher: 0,
  class: 0,
  dp: 0,
  yesDp: 0
})

onMounted(() => {
  getAdminDashboardData().then(d => {
    counts.student = d[0].data.data
    counts.teacher = d[1].data.data
    counts.class = d[2].data.data
    counts.dp = d[3].data.data
    counts.yesDp = d[4].data.data

    sourceOfTotalDPCount.value = counts.dp
  })
})
</script>

<template>
  <div class="container">
    <span class="subtitle">School Overview</span>
    <el-row :gutter="16" class="spreading">
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="counts.student">
            <template #title>
              <div style="display: inline-flex; align-items: center;">
                Total Students
              </div>
            </template>
            <template #prefix>
              <el-icon>
                <UserFilled/>
              </el-icon>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span class="green">
                 {{ Math.round((counts.student / (counts.student + counts.teacher)) * 100) }}%
              </span>
              <span>of the total</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="counts.teacher">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Total Teachers
              </div>
            </template>
            <template #prefix>
              <el-icon>
                <Avatar/>
              </el-icon>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span class="green">
                {{ Math.round((counts.teacher / (counts.student + counts.teacher)) * 100) }}%
              </span>
              <span>of the total</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="counts.class">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Total Classes
              </div>
            </template>
            <template #prefix>
              <el-icon>
                <HomeFilled/>
              </el-icon>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span class="green">
                {{ Math.round((counts.student + counts.teacher) / counts.class) }}
              </span>
              <span>average people</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="TotalDPCount">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Total DP Dispatched
              </div>
            </template>
            <template #prefix>
              <el-icon>
                <ChatLineRound/>
              </el-icon>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>than yesterday</span>
              <span :class="counts.yesDp >= 0? 'green' : 'red'">
              {{ counts.yesDp }}
              <el-icon v-if="counts.yesDp >= 0">
                <CaretTop/>
              </el-icon>
              <el-icon v-else>
                <CaretBottom/>
              </el-icon>
            </span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <span class="subtitle">Monthly DP Activity</span>
    <el-row :gutter="16" class="spreading">
      <el-col :span="24">
        <div class="chartContainer">
          <Line :data="data" :options="options"></Line>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.subtitle {
  font-size: var(--el-font-size-large);
  font-weight: bold;
  color: white;
}

.spreading {
  margin-top: 8px;
  margin-bottom: 32px;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

.chartContainer {
  position: relative;
}
</style>

<style>
.el-statistic .el-statistic__content {
  display: flex;
}
</style>