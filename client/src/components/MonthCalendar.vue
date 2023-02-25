<script setup lang="ts">
import { toRefs, computed } from "vue";
import { getAllDates, getDayName } from "@/utils";

type MonthCalendarProps = {
  selectedDate: Date;
};

type MonthCalendarEmits = {
  (event: "onChange", date: Date): void;
};

let props = defineProps<MonthCalendarProps>();

let emit = defineEmits<MonthCalendarEmits>();

let { selectedDate } = toRefs(props);

let dates = computed(() => getAllDates(selectedDate.value));
</script>

<template>
  <div :class="styles.container">
    <div v-for="(date, index) in dates" :class="styles.date_box" :key="index">
      <div :class="styles.header">
        <span v-if="index <= 6" :class="styles.week">{{
          getDayName(date.getDay())
        }}</span
        ><span :class="styles.day" @click="emit('onChange', date)">{{
          date.getDate()
        }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  border-style: solid;
  border-color: rgb(218, 220, 224);
  border-width: 0px 0px 1px 1px;
  height: 100%;
  overflow-y: auto;
  .date_box {
    border-style: solid;
    border-color: rgb(218, 220, 224);
    border-width: 1px 1px 0px 0px;
    padding: 10px;
    &:is(
        :nth-child(1),
        :nth-child(2),
        :nth-child(3),
        :nth-child(5),
        :nth-child(6),
        :nth-child(7)
      ) {
      border-width: 0px 1px 0px 0px;
    }
    .header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      span {
        font-family: "Poppins-Medium", sans-serif;
      }
      .week {
        color: #70757a;
        font-size: 14px;
      }
      .day {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        width: 24px;
        height: 24px;
        color: #3c4043;
        font-size: 12px;
        border-radius: 50%;
        transition: background-color 0.25ms ease-in-out;
        cursor: pointer;
        &:hover {
          background-color: #f1f3f4;
        }
      }
    }
  }
}
</style>
