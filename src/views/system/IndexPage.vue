<template>
  <div class="background">
    <div class="welcome-container">
      <div class="welcome-content">
        <h1 class="welcome-title">欢迎使用房屋出租系统</h1>
        <p class="welcome-subtitle">便捷、高效、可靠的房屋租赁平台</p>
        <div class="features">
          <div class="feature-item">
            <div class="feature-icon">🏠</div>
            <h3>房源丰富</h3>
            <p>海量优质房源任您挑选</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <h3>安全可靠</h3>
            <p>交易有保障</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <h3>高效便捷</h3>
            <p>在线签约，轻松管理</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.background {
  height: 800px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-container {
  width: 100%;
  padding: 20px;
  text-align: center;
}

.welcome-content {
  height: 700px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  padding: 40px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.welcome-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0 0 15px;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin: 0 0 40px;
  font-weight: 400;
}

.features {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.feature-item {
  background: white;
  border-radius: 12px;
  padding: 10px 20px 40px 20px;
  width: 220px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
}

.feature-icon {
  font-size: 4rem;
  margin-bottom: 15px;
}

.feature-item h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 10px 0;
}

.feature-item p {
  font-size: 0.95rem;
  color: #7f8c8d;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 2rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .features {
    flex-direction: column;
    align-items: center;
  }

  .feature-item {
    width: 100%;
    max-width: 300px;
    max-height: 120px;
  }
}
</style>
