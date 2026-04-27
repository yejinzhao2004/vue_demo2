<template>
  <div class="container">
    <el-row :gutter="10">
      <el-col :span="5.5">
        <el-card class="grid-content" style="width: 400px; margin-left: 250px">
          <div class="text-with-underline" style="margin-bottom: 57px">申请新房源</div>
          <HouseUpload />
        </el-card>
      </el-col>
      <el-col :span="1">
        <el-card class="grid-content" style="width: 700px">
          <div class="text-with-underline">房源状态</div>
          <HouseStatus />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import HouseUpload from '../../components/HouseUpload.vue'
import HouseStatus from '../../components/HouseStatus.vue'
</script>

<style scoped>
.container {
  padding: 5px 15px;
  box-sizing: border-box;
}
.text-with-underline {
  /* 添加下划线 */
  border-bottom: 1px solid #464646; /* 蓝色下划线，可自定义颜色 */
  padding-bottom: 2px; /* 文字与下划线的间距 */
  display: inline-block; /* 让下划线与文字宽度匹配 */
  font-size: 18px;
  font-weight: 600;
  color: #000000;
}
.el-row {
  margin-bottom: 20px;
  display: flex;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
  height: 100%;
}

.grid-content {
  background-color: rgb(255, 255, 255);
  border-radius: 4px;
  min-height: 36px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 1);
  padding-top: 10px;
  margin-bottom: 10px;
  height: 750px;
  text-align: center;
}
</style>
