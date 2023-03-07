<script setup lang="ts">
import { toRefs, computed, ref } from "vue";
import dayjs from "dayjs";
import { getAllDates } from "@/utils";

type DatePickerProps = {
  selectedDate: Date;
  calenderDate?: Date;
  showArrow?: boolean;
  showYear?: boolean;
};

type DatePickerEmits = {
  (event: "onChange", date: Date): void;
};

let props = withDefaults(defineProps<DatePickerProps>(), {
  showArrow: true,
  showYear: true,
});

let emit = defineEmits<DatePickerEmits>();

let { selectedDate, calenderDate } = toRefs(props);

let currentDate = ref(new Date());

let weeks = ["S", "M", "T", "W", "T", "F", "S"];

let actualDate = computed(() =>
  calenderDate && calenderDate.value ? calenderDate.value : currentDate.value
);

let dates = computed(() => getAllDates(actualDate.value));

let handleNext = () => {
  let date = structuredClone(currentDate.value);
  let month = date.getMonth();

  if (month !== 11) {
    date.setMonth(month + 1);
  } else {
    let year = date.getFullYear();
    date.setFullYear(year + 1);
    date.setMonth(0);
  }

  setCurrentDate(date);
};

let handlePrevious = () => {
  let date = structuredClone(currentDate.value);
  let month = date.getMonth();

  if (month !== 1) {
    date.setMonth(month - 1);
  } else {
    let year = date.getFullYear();
    date.setFullYear(year - 1);
    date.setMonth(11);
  }

  setCurrentDate(date);
};

let setCurrentDate = (date: Date) => {
  currentDate.value = date;
};

defineExpose({
  setCurrentDate,
});
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.header">
      <span>{{
        dayjs(actualDate).format(showYear ? "MMMM YYYY" : "MMMM")
      }}</span>
      <div v-if="showArrow" :class="styles.arrow">
        <i class="bx-chevron-left" @click="handlePrevious"></i>
        <i class="bx-chevron-right" @click="handleNext"></i>
      </div>
    </div>
    <div :class="styles.date_picker">
      <span :class="styles.week" v-for="(week, index) in weeks" :key="index">{{
        week
      }}</span>
      <span
        v-for="(date, index) in dates"
        :class="[
          styles.day,
          actualDate.getMonth() !== date.getMonth()
            ? styles.in_active
            : dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
            ? styles.highlight
            : dayjs(date).format('YYYY-MM-DD') ===
                dayjs(selectedDate).format('YYYY-MM-DD') && styles.active,
          ,
        ]"
        :key="index"
        v-bind="{
          ...(actualDate.getMonth() === date.getMonth()
            ? {
                'data-date': dayjs(date).format('YYYY-MM-DD'),
                onClick: () => emit('onChange', date),
              }
            : {}),
        }"
        >{{ date.getDate() }}</span
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
      color: #3c4043;
      border-radius: 50%;
      transition: background-color 0.25ms cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      &:is(.highlight) {
        background-color: #1967d2;
        color: white;
      }
      &:is(.active) {
        background-color: #afcbfa;
        color: #185abc;
      }
      &:is(.in_active) {
        color: #70757a;
      }
      &:hover:not(.highlight, .active) {
        background-color: #f1f3f4;
      }
    }
    .week {
      color: #70757a;
      cursor: default;
    }
  }
}
</style>
