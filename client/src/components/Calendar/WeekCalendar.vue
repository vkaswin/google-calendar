<script setup lang="ts">
import { getDayName } from "@/utils";
import { toRefs, computed } from "vue";

type WeekCalendarProps = {
  selectedDate: Date;
};

let props = defineProps<WeekCalendarProps>();

let { selectedDate } = toRefs(props);

let todayDate = new Date();

let times = [
  null,
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 AM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
];

let dates = computed(() => {
  let dates: Date[] = [];
  let date = structuredClone(selectedDate.value);

  dates.push(structuredClone(date));

  for (let i = date.getDay(); i < 6; i++) {
    date.setDate(date.getDate() + 1);
    dates.push(structuredClone(date));
  }

  date = selectedDate.value;

  for (let i = selectedDate.value.getDay(); i > 0; i--) {
    date.setDate(date.getDate() - 1);
    dates.unshift(structuredClone(date));
  }

  return dates;
});

let togglePopup = (data?: { row: number; column: number }) => {
  if (data) {
    let { row, column } = data;
    console.log(
      "🚀 ~ file: WeekCalendar.vue:66 ~ togglePopup ~ row,column:",
      row,
      column
    );
  } else {
    console.log("close popup");
  }
};
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.week_wrapper">
      <div
        v-for="(date, index) in dates"
        :key="index"
        :class="[
          styles.week_title,
          todayDate.toLocaleDateString() === date.toLocaleDateString() &&
            styles.highlight,
        ]"
      >
        <span>{{ getDayName(date.getDay()) }}</span>
        <span>{{ date.getDate() }}</span>
      </div>
    </div>
    <div :class="styles.cell_top">
      <div v-for="index in 7" :key="index"></div>
    </div>
    <div :class="styles.time_container">
      <div :class="styles.time_wrapper">
        <div :class="styles.time" v-for="(time, index) in times" :key="index">
          <span>{{ time }}</span>
        </div>
      </div>
      <div :class="styles.cell_container">
        <div :class="styles.cell_row" v-for="row in times.length" :key="row">
          <div
            :class="styles.cell_column"
            v-for="column in 7"
            :key="column"
            @click="togglePopup({ row, column })"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  height: 100%;
  padding-top: 15px;
  overflow-y: hidden;
  --week-wrapper-height: 69px;
  --light-gray: rgb(218, 220, 224);
  .week_wrapper {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    height: var(--week-wrapper-height);
    margin: 0px 0px 15px 40px;
    .week_title {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      &:is(.highlight) {
        span {
          &:first-child {
            color: rgb(26, 115, 232);
          }
          &:last-child {
            color: #fff;
            background-color: rgb(26, 115, 232);
          }
        }
      }
      &:not(.highlight) {
        span {
          &:last-child {
            &:hover {
              background-color: #f1f3f4;
            }
          }
        }
      }
      span {
        &:first-child {
          color: #70757a;
          font-size: 14px;
        }
        &:last-child {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          color: #70757a;
          font-size: 24px;
          font-family: "Poppins-Medium", sans-serif;
          transition: background-color, color 0.25s ease-in-out;
          cursor: pointer;
        }
      }
    }
  }
  .time_container {
    position: relative;
    display: flex;
    overflow-y: auto;
    height: calc(100% - (var(--week-wrapper-height) + 15px));
    .time_wrapper {
      display: grid;
      grid-template-columns: 40px;
      grid-auto-rows: 50px;
      .time {
        display: flex;
        gap: 10px;
        margin-top: -5px;
        span {
          color: #70757a;
          font-size: 10px;
          font-family: "Poppins-Medium", sans-serif;
        }
      }
    }
    .cell_container {
      flex-grow: 1;
      .cell_row {
        position: relative;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: 50px;
        cursor: pointer;
        &::after {
          content: "";
          position: absolute;
          border-top: 1px solid var(--light-gray);
          width: 10px;
          left: -10px;
          top: -1px;
        }
        .cell_column {
          border-style: solid;
          border-color: var(--light-gray);
          border-width: 0px 0px 1px 1px;
        }
      }
    }
  }
  .cell_top {
    position: sticky;
    left: 40px;
    width: calc(100% - 55px);
    height: 1px;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    div {
      position: relative;
      border-top: 1px solid var(--light-gray);
      &:first-child::after {
        content: "";
        position: absolute;
        top: -1px;
        left: -10px;
        height: 1px;
        width: 10px;
        background-color: var(--light-gray);
      }
      &::before {
        content: "";
        position: absolute;
        top: -20px;
        left: 0px;
        height: 20px;
        width: 1px;
        background-color: var(--light-gray);
      }
    }
  }
}
</style>
