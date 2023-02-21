<script setup lang="ts">
import { ref } from "vue";
import WeekCalendar from "@/components/Calendar/WeekCalendar.vue";
import MonthCalendar from "@/components/Calendar/MonthCalendar.vue";
import YearCalendar from "@/components/Calendar/YearCalendar.vue";
import DatePicker from "@/components/Calendar/DatePicker.vue";
import useCalendar from "@/store/useCalendar";
import { storeToRefs } from "pinia";

let calendarStore = useCalendar();

let { setView, setDate, handleNext, handlePrevious } = calendarStore;

let { view, date } = storeToRefs(calendarStore);

let expanded = ref(true);

let datePicker = ref<InstanceType<typeof DatePicker>>();

let toggleMenu = () => {
  expanded.value = !expanded.value;
};

let handleDateChange = (date: Date) => {
  setDate(date);
};

let resetDate = () => {
  let date = new Date();
  datePicker.value?.setCurrentDate(date);
  setDate(date);
};

let handleChange = (date: Date) => {
  console.log("🚀 ~ file: Calendar.vue:35 ~ handleChange ~ date:", date);
};
</script>

<template>
  <div :class="styles.header">
    <div :class="styles.logo">
      <i class="bx-menu" @click="toggleMenu"></i>
      <img src="@/assets/images/calendar.png" />
      <span>Calender</span>
    </div>
    <div>
      <button @click="resetDate">Today</button>
      <div>
        <button @click="handlePrevious">
          <i class="bx-chevron-left"></i>
        </button>
        <button @click="handleNext">
          <i class="bx-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
  <div :class="styles.create_btn" :aria-expanded="expanded">
    <svg viewBox="0 0 36 36">
      <path fill="#34A853" d="M16 16v14h4V20z"></path>
      <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
      <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
      <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
      <path fill="none" d="M0 0h36v36H0z"></path>
    </svg>
    <span>Create</span>
  </div>
  <div :class="styles.sidebar" :aria-expanded="expanded">
    <DatePicker
      ref="datePicker"
      :selected-date="date"
      @on-change="handleDateChange"
    />
  </div>
  <div :class="styles.calender" :aria-expanded="expanded">
    <WeekCalendar v-if="view === 'week'" />
    <MonthCalendar
      v-if="view === 'month'"
      :selected-date="date"
      @on-change="handleChange"
    />
    <YearCalendar
      v-if="view === 'year'"
      :selected-date="date"
      @on-change="setDate"
    />
  </div>
</template>

<style lang="scss" module="styles">
.header {
  position: fixed;
  display: flex;
  align-items: center;
  top: 0px;
  left: 0px;
  background-color: #ffffff;
  height: var(--header-height);
  padding: 0px 15px;
  z-index: 999;
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

.create_btn {
  position: absolute;
  top: calc(var(--header-height) + 15px);
  left: 15px;
  display: flex;
  align-items: center;
  gap: 7px;
  background-color: rgba(255, 255, 255, 0.502);
  box-shadow: 0px 1px 2px 0px rgba(60, 64, 67, 0.3),
    0px 1px 3px 1px rgba(60, 64, 67, 0.15);
  height: var(--create-btn-height);
  z-index: 998;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 4px 4px 0px rgba(60, 64, 67, 0.3),
      0px 8px 12px 6px rgba(60, 64, 67, 0.15);
    background-color: #f6fafe;
  }
  svg {
    width: 36px;
    height: 36px;
  }
  span {
    color: #3d4043;
  }
}

.create_btn[aria-expanded="true"] {
  width: 130px;
  border-radius: 25px;
  padding: 0px 15px;
}

.create_btn[aria-expanded="false"] {
  justify-content: center;
  width: 48px;
  padding: 0px;
  border-radius: 50%;
  span {
    display: none;
  }
}

.sidebar {
  position: absolute;
  top: calc(
    var(--header-height) + var(--create-btn-height) + var(--base-padding)
  );
  width: var(--sidebar-width);
  transition: left 0.25s ease-in-out;
  padding: 15px;
}

.sidebar[aria-expanded="true"] {
  left: 0px;
}

.sidebar[aria-expanded="false"] {
  left: -250px;
}

.calender {
  position: relative;
  padding: calc(var(--header-height) + var(--base-padding)) var(--base-padding)
    var(--base-padding) var(--base-padding);
  transition-property: left, width;
  transition-duration: 0.25s;
  transition-timing-function: ease-in-out;
}

.calender[aria-expanded="true"] {
  width: calc(100% - var(--sidebar-width));
  left: var(--sidebar-width);
}

.calender[aria-expanded="false"] {
  width: 100%;
  left: 0px;
}
</style>
