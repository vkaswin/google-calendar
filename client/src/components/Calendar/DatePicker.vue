<script setup lang="ts">
import { toRefs, computed } from "vue";

type DatePickerProps = {
  date: Date;
};

type Dates = {
  date: string;
  day: string;
};

const props = defineProps<DatePickerProps>();

let { date } = toRefs(props);

let weeks = ["S", "M", "T", "W", "T", "F", "S"];

let [todayDate] = new Date().toISOString().split("T");

let totalEntries = 35;

let days = computed(() => {
  let dates: Dates[] = [];

  for (let i = 1; i <= date.value.getTodayDaysInMonth(); i++) {
    let day = i.toString();

    dates.push({
      day,
      date: `${date.value.getFullYear()}-${(date.value.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${day.padStart(2, "0")}`,
    });
  }

  console.log(dates);

  return dates;
});
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.header">
      <span>{{ `${date.getMonthName()} ${date.getFullYear()}` }}</span>
      <div :class="styles.arrow">
        <i class="bx-chevron-left"></i>
        <i class="bx-chevron-right"></i>
      </div>
    </div>
    <div :class="styles.date_picker">
      <span :class="styles.week" v-for="(week, index) in weeks" :key="index">{{
        week
      }}</span>
      <span
        v-for="({ day, date }, index) in days"
        :class="[styles.day, date === todayDate && styles.highlight]"
        :key="index"
        >{{ day }}</span
      >
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      color: #3c4043;
      font-family: "Poppins-Medium", sans-serif;
    }
    .arrow {
      display: flex;
      gap: 10px;
      i {
        color: #5f6368;
        font-size: 24px;
        cursor: pointer;
      }
    }
  }
  .date_picker {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    place-items: center;
    gap: 5px;
    .week,
    .day {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      width: 24px;
      height: 24px;
      font-family: "Poppins-Medium", sans-serif;
    }
    .week {
      color: #70757a;
      cursor: default;
    }
    .day {
      color: #3c4043;
      cursor: pointer;
      &:is(.highlight) {
        background-color: #1967d2;
        color: white;
        border-radius: 50%;
      }
    }
  }
}
</style>
