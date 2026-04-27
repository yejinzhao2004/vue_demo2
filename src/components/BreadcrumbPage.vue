<template>
  <el-icon> <House /> &nbsp;</el-icon>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :key="index" v-for="(item, index) in breadcrumbList">
      <span>{{ item.name }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
const breadcrumbList = ref([])
const route = useRoute()
const initBreadcrumbList = () => {
  breadcrumbList.value = route.matched
}
watch(route, () => {
  initBreadcrumbList()
})
onMounted(() => {
  initBreadcrumbList()
})
</script>

<style scoped></style>
