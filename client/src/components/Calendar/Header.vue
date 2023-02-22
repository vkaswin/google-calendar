<script setup lang="ts">
import { toRefs } from "vue";
import { getMonthName } from "@/utils";
import { CalendarView } from "@/types/calendar";

type HeaderProps = {
  date: Date;
};

type HeaderEmits = {
  (event: "onReset"): void;
  (event: "onToggle"): void;
  (event: "onNext"): void;
  (event: "onPrevious"): void;
  (event: "onViewChange", view: CalendarView): void;
};

let props = defineProps<HeaderProps>();

let { date } = toRefs(props);

let emit = defineEmits<HeaderEmits>();
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.logo">
      <i class="bx-menu" @click="emit('onToggle')"></i>
      <img src="@/assets/images/calendar.png" />
      <span>Calender</span>
    </div>
    <div>
      <button @click="emit('onReset')">Today</button>
      <div>
        <button @click="emit('onPrevious')">
          <i class="bx-chevron-left"></i>
        </button>
        <button @click="emit('onNext')">
          <i class="bx-chevron-right"></i>
        </button>
        <span>{{
          `${getMonthName(date.getMonth())} ${date.getFullYear()}`
        }}</span>
        <button @click="emit('onViewChange', 'month')">Dropdown</button>
      </div>
    </div>
    <div></div>
    <div :class="styles.avatar">
      <img src="" />
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  position: fixed;
  display: flex;
  align-items: center;
  top: 0px;
  left: 0px;
  background-color: #ffffff;
  height: var(--header-height);
  padding: 0px 15px;
  z-index: 1;
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12),
    0 2px 4px -1px rgba(0, 0, 0, 0.2);
  width: 100%;
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    i {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #606368;
      font-size: 28px;
      cursor: pointer;
      &:hover {
        background-color: #f0f0f0;
      }
    }
    img {
      width: 44px;
      height: 40px;
    }
    span {
      color: #3c4043;
      font-family: "Poppins-Medium", sans-serif;
      font-size: 20px;
    }
  }
}
</style>
