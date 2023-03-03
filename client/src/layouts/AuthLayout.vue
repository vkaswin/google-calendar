<template>
  <div :class="styles.container">
    <router-view />
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  background-color: #e3edfd;
}
</style>
