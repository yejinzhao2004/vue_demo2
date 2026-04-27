<script setup>
import AvatarPage from '../components/AvatarPage.vue'
import BreadcrumbPage from '../components/BreadcrumbPage.vue'
</script>

<template>
  <div class="navbar">
    <BreadcrumbPage />
    <div class="navbar-right">
      <AvatarPage />
    </div>
  </div>
</template>

<style scoped>
.navbar {
  width: 100%;
  height: 60px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 16px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}

.navbar-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
