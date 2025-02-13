<script lang="ts" setup>
import {HomeFilled, Menu, MessageBox, Setting, User} from "@element-plus/icons-vue";
import type {Student} from "~/types/User";
import Overview from "~/components/Student/Overview.vue";
import Log from "~/components/Student/Log.vue";
import Settings from "~/components/Student/Settings.vue";
import {storeToRefs} from "pinia";
import {useDPDataStore} from "~/composables/DPDataStore";
import type {DPLog} from "~/types/DPType";
import {getCompareLogs, getLogs} from "~/utils/fetch";

const store = useUserStore()
const dpStore = useDPDataStore()

const name = (store.user as Student).name
const clazz = (store.user as Student).clazz
const {currentItem} = storeToRefs(store)
const {shouldBeUpdate} = storeToRefs(dpStore)

const onMenuOpen = function (index: string) {
  currentItem.value = +index
  shouldBeUpdate.value++
}

const isCollapse = ref(false)
const mediaQuery = window.matchMedia('(min-width: 1024px)')
window.addEventListener("resize", () => {
  isCollapse.value = !mediaQuery.matches
})

watch(shouldBeUpdate, () => {
  getLogs(store.jwt).then(d => {
    let res: DPLog[] = []
    for (let i = 0; i < d.data.data.length; i++) {
      let t = d.data.data[i]
      res.push(createDP(t.logType, t.logLocation, t.dp, t.date, t.remark, t.appeal))
    }
    dpStore.$patch(state => {
      state.rawUserDP = res
    })
  })

  getCompareLogs(store.jwt).then(d => {
    dpStore.$patch(state => {
      state.averageDP = d.data.data
    })
  })
}, {immediate: true})
</script>

<template>
  <div id="student">
    <el-container>
      <el-header>
        <el-popover :content="$t('student.current_dp') + dpStore.getTotalDP.toString()" :title="$t('student.total_dp')" trigger="hover">
          <template #reference>
            <el-page-header icon="null">
              <template #title>
                <el-icon>
                  <HomeFilled/>
                </el-icon>
                <span>{{ clazz }}</span>
              </template>
              <template #content>
                <el-icon>
                  <User/>
                </el-icon>
                <span>{{ name }}</span>
              </template>
            </el-page-header>
          </template>
        </el-popover>
      </el-header>
      <el-container>
        <el-aside :class="isCollapse ? 'closed-aside': 'opened_aside'">
          <el-menu
              default-active="0"
              @select="onMenuOpen"
              :collapse="isCollapse"
          >
            <el-menu-item index="0">
              <el-icon>
                <Menu/>
              </el-icon>
              <span>{{$t("student.menu.dp_overview")}}</span>
            </el-menu-item>
            <el-menu-item index="1">
              <el-icon>
                <MessageBox/>
              </el-icon>
              <span>{{$t("student.menu.dp_log")}}</span>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon>
                <setting/>
              </el-icon>
              <span>{{$t("student.menu.dp_settings")}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <Overview v-if="store.currentItem === 0"></Overview>
          <Log v-if="store.currentItem === 1"></Log>
          <Settings v-if="store.currentItem === 2"></Settings>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
#student, .el-container {
  height: 100%;
  width: 100%;
}

.el-header {
  width: 100%;
  display: flex;
  justify-content: center;
}

.el-page-header {
  display: flex;
  align-items: center;
  height: 100%;
  border-bottom: 1px solid var(--el-border-color);
}

i {
  margin-right: 4px;
}
.el-menu, .el-main {
  height: 100%;
}

.el-main {
  width: 100%;
  overflow-y: hidden;
}

.closed-aside {
  width: auto;
}
.opened-aside {
  width: 300px;
}
</style>