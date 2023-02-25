<script setup lang="ts"></script>

<template>
  <div :class="styles.container">
    <input placeholder="Search" />
    <i className="bx-search"></i>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  input {
    height: 45px;
    max-width: 768px;
    width: 100%;
    background: #f1f3f4;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 0px 40px 0px 15px;
    outline: none;
    &:focus {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 1px 1px 0 rgba(65, 69, 73, 0.3),
        0 1px 3px 1px rgba(65, 69, 73, 0.15);
    }
  }
  i {
    position: absolute;
    right: 5px;
    font-size: 22px;
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #606368;
    font-size: 22px;
    border-radius: 50%;
    transition: background-color 0.25s ease-in-out;
    cursor: pointer;
    &:hover {
      background-color: #dadce0;
    }
  }
}
</style>
