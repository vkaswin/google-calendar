<script setup lang="ts">
import { getDayName } from "@/utils";
import { toRefs, computed } from "vue";

type WeekCalendarProps = {
  selectedDate: Date;
};

let props = defineProps<WeekCalendarProps>();

let { selectedDate } = toRefs(props);

let todayDate = new Date();

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
</script>

<template>
  <div :class="styles.week_container">
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
</template>

<style lang="scss" module="styles">
.week_container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
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
        width: 50px;
        height: 50px;
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
</style>
