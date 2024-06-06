<script lang="ts" setup>
import {
  banUser,
  getServerInfo,
  getStudentByUuid,
  getTeacherByUuid,
  getTotalLogins,
  isBannedUser,
  unbanUser
} from "~/utils/fetch";
import type {Ref} from "@vue/reactivity";
import type {HealthData} from "~/types/systemInfo";
import {CaretBottom, CaretTop, Search, Warning} from "@element-plus/icons-vue";
import {teacherLevelConverter} from "~/utils/ConvertLevelUtils";

const store = useUserStore()
const systemData: Ref<HealthData | undefined> = ref()
const totalLogins = ref("Loading...")

const queryStudentInput = ref()
const studentTypeSelect = ref("1")
const banUserDialogVisible = ref(false)
const banUserDetail = ref()
const banDuration = ref(1)
const isUserAlreadyBanned = ref()
const isExpiredFormatter = (row: any) => {
  return row.isExpired === 0 ? "No" : "Yes"
}
const isDeletedFormatter = (row: any) => {
  return row.isDeleted === 0 ? "No" : "Yes"
}
const teacherLevelFormatter = (row: any) => {
  return teacherLevelConverter(row.teacherLevel)
}
const submitQueryStudent = () => {
  if (!studentTypeSelect.value || !queryStudentInput.value) {
    ElMessage.error("Fields cannot be null.")
    return
  }

  // Callbacks hell
  new Promise((resolve, reject) => {
    new Promise((resolve1, reject1) => {
      if (studentTypeSelect.value === "1") {
        getStudentByUuid(store.jwt, queryStudentInput.value).then(d => {
          if (d.data.data) resolve1(d.data.data)
          else reject1()
        })
      } else {
        getTeacherByUuid(store.jwt, queryStudentInput.value).then(d => {
          console.log(d.data.data)
          if (d.data.data) resolve1(d.data.data)
          else reject1()
        })
      }
    }).then(data => {
      banUserDetail.value = data
      if (studentTypeSelect.value === "1") {
        isBannedUser(store.jwt, {type: "student", uuid: queryStudentInput.value}).then(d => {
          resolve(d)
        })
      } else {
        isBannedUser(store.jwt, {type: "teacher", uuid: queryStudentInput.value}).then(d => {
          resolve(d)
        })
      }
    }).catch(() => {
      ElMessage.error("User Not Found.")
    })
  }).then(data => {
    isUserAlreadyBanned.value = (data as { data: boolean }).data
    banUserDialogVisible.value = true
    if ((data as { data: boolean }).data) {
      ElMessageBox.alert("This user already got banned!", "Notice")
    }
  })
}

const confirmBanUserDialog = () => {
  banUser(store.jwt, {
    type: studentTypeSelect.value === "1" ? "student" : "teacher",
    uuid: queryStudentInput.value,
    duration: banDuration.value
  }).then(() => {
    ElMessage.success("User banned.")
    banUserDialogVisible.value = false
  })
}
const confirmUnbanUserDialog = () => {
  ElMessageBox.confirm("Are you sure you want to UNBAN this user?", "Warning").then(() => {
    unbanUser(store.jwt, {type: studentTypeSelect.value === "1" ? "student" : "teacher", uuid: queryStudentInput.value})
        .then(() => {
          ElMessage.success("User unbanned.")
        })
  }).catch(e => {
  }).finally(() => banUserDialogVisible.value = false)
}

const getDiskPercentage = computed(() => {
  return ~~(systemData.value?.health?.components?.diskSpace?.details?.free as number /
      (systemData.value?.health?.components?.diskSpace?.details?.total as number) * 100)
})
const getMemoryPercentage = computed(() => {
  return ~~((systemData.value?.metrics[3]?.measurements[0]?.value as number /
      (systemData.value?.metrics[2]?.measurements[0]?.value as number)) * 100)
})

const colors = [
  {color: '#f56c6c', percentage: 20},
  {color: '#e6a23c', percentage: 40},
  {color: '#5cb87a', percentage: 60},
  {color: '#1989fa', percentage: 80},
  {color: '#6f7ad3', percentage: 100},
]

const isLoaded = ref(false)
onMounted(() => {
  getServerInfo(store.jwt).then(d => {
    systemData.value = d.data
    isLoaded.value = true
  })
  getTotalLogins().then(d => {
    totalLogins.value = d.data
  })
})
</script>

<template>
  <div v-if="isLoaded" v-loading="!isLoaded" class="container">
    <div class="title">
      <h1>System Information</h1>
      <el-tooltip
          :content="`${(systemData as HealthData).metrics[0].description}:
          ${(systemData as HealthData).metrics[0].measurements[0].value}
          ${(systemData as HealthData).metrics[0].baseUnit}.`"
          effect="dark"
          placement="bottom"
      >
        <el-icon :size="12" style="margin-left: 4px">
          <Warning/>
        </el-icon>
      </el-tooltip>
    </div>
    <el-row :gutter="16">
      <el-col :span="8">
        <el-card>
          <template #header>
            <div>
              <span>JVM Info</span>
            </div>
          </template>
          <div class="detail">
            <img alt="java" class="icon" src="/icons/java.svg"/>
            <div class="iconDescription">
              <div>
                <h2>Runtime: </h2>
                <span>{{ (systemData as HealthData).metrics[1].availableTags[1].values[0] }}</span>
              </div>
              <div>
                <h2>Version: </h2>
                <span>{{ (systemData as HealthData).metrics[1].availableTags[2].values[0] }}</span>
              </div>
              <div>
                <h2>Memory Used: </h2>
                <el-progress :percentage="getMemoryPercentage"></el-progress>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div>
              <span>Disk Info</span>
            </div>
          </template>
          <div class="detail">
            <img alt="hdd" class="icon" src="/icons/hdd.svg"/>
            <div class="iconDescription">
              <div>
                <h2>Disk Used: </h2>
                <el-progress :color="colors" :percentage="getDiskPercentage"/>
              </div>
              <div>
                <h2>Database: </h2>
                <span>{{ (systemData as HealthData)?.health?.components?.db?.details?.database }}</span>
              </div>
              <div>
                <h2>Status: </h2>
                <span v-if="systemData?.health.components.db?.status === 'UP'" class="green">
                  UP
                  <el-icon>
                    <CaretTop/>
                  </el-icon>
                </span>
                <span v-else class="red">
                  DOWN
                  <el-icon>
                    <CaretBottom/>
                  </el-icon>
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div>
              <span>Redis Info</span>
            </div>
          </template>
          <div class="detail">
            <img alt="redis" class="icon" src="/icons/redis.svg"/>
            <div class="iconDescription">
              <div>
                <h2>Redis Version: </h2>
                <span>{{ (systemData as HealthData)?.health?.components?.redis?.details?.version }}</span>
              </div>
              <div>
                <div style="display: flex; flex-direction: row; align-items: center;">
                  <h2>Total Logins: </h2>
                  <el-tooltip
                      content="Only for clicked"
                      effect="dark"
                      placement="top"
                  >
                    <el-icon :size="12" style="margin-left: 4px">
                      <Warning/>
                    </el-icon>
                  </el-tooltip>
                </div>
                <span>{{ totalLogins }}</span>
              </div>
              <div>
                <h2>Status: </h2>
                <span v-if="systemData?.health?.components?.redis?.status === 'UP'" class="green">
                  UP
                  <el-icon>
                    <CaretTop/>
                  </el-icon>
                </span>
                <span v-else class="red">
                  DOWN
                  <el-icon>
                    <CaretBottom/>
                  </el-icon>
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider/>
    <h1>Ban or Unban User</h1>
    <div class="queryClass">
      <el-input v-model="queryStudentInput" :prefix-icon="Search" placeholder="Type user's UUID">
        <template #prepend>
          <el-select v-model="studentTypeSelect" placeholder="Select" style="width: 115px">
            <el-option label="Student" value="1"/>
            <el-option label="Teacher" value="2"/>
          </el-select>
        </template>
      </el-input>
      <el-button type="primary" @click="submitQueryStudent">Query</el-button>
    </div>

    <el-dialog
        v-model="banUserDialogVisible"
        align-center
        destroy-on-close
        title="Confirm"
    >
      <el-table v-if="studentTypeSelect === '1'" :data="[banUserDetail]" style="width: 100%">
        <el-table-column label="UUID" prop="studentUuid"></el-table-column>
        <el-table-column label="ID" prop="studentId"></el-table-column>
        <el-table-column label="Class" prop="studentClass"></el-table-column>
        <el-table-column label="Name" prop="studentName"></el-table-column>
        <el-table-column label="Sex" prop="studentSex"></el-table-column>
        <el-table-column label="Age" prop="studentAge"></el-table-column>
        <el-table-column :formatter="isExpiredFormatter" label="Expired" prop="isExpired"></el-table-column>
      </el-table>
      <el-table v-else :data="[banUserDetail]" style="width: 100%">
        <el-table-column label="UUID" prop="teacherUuid"></el-table-column>
        <el-table-column label="ID" prop="teacherId"></el-table-column>
        <el-table-column label="Class" prop="teacherClass"></el-table-column>
        <el-table-column label="Name" prop="teacherName"></el-table-column>
        <el-table-column :formatter="teacherLevelFormatter" label="Level" prop="teacherLevel"></el-table-column>
        <el-table-column :formatter="isDeletedFormatter" label="Deleted" prop="isDeleted"></el-table-column>
      </el-table>

      <div style="margin-top: 16px">
        <h1 style="margin-bottom: 8px">Set ban duration: </h1>
        <el-input-number v-model="banDuration" :max="365" :min="1"/>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="banUserDialogVisible = false">Cancel</el-button>
          <el-button v-if="isUserAlreadyBanned" type="danger" @click="confirmUnbanUserDialog">
            UNBAN
          </el-button>
          <el-button type="primary" @click="confirmBanUserDialog">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.title {
  display: inline-flex;
  align-items: center;
  margin-bottom: 16px;
}

.detail {
  display: flex;
  flex-direction: row;
}

.icon {
  width: 64px;
  height: 64px;
  margin-right: 20px;
}

.iconDescription {
  width: 100%;
}

.iconDescription h2 {
  font-size: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.iconDescription span {
  font-size: 14px;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

.queryClass {
  display: flex;
  flex-direction: row;
  margin-top: 16px;
}

.queryClass .el-input {
  max-width: 300px;
  margin-right: 8px;
}
</style>