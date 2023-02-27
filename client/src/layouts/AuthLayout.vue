<template>
  <div :class="styles.container">
    <div :class="styles.wrapper">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .wrapper {
    position: relative;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
    background-color: #fff;
    border: 1px solid #dadce0;
    border-radius: 8px;
    max-width: 450px;
    width: 100%;
    min-height: 450px;
    padding: 30px;
    &::before {
      content: "";
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 8px;
      background-color: gray;
      border-radius: 4px 4px 0px 0px;
    }
  }
}
</style>
