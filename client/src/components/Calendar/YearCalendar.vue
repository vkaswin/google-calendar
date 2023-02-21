<script setup lang="ts">
import { emit } from "process";
import { toRefs, computed } from "vue";
import DatePicker from "./DatePicker.vue";

type YearCalendarProps = {
  selectedDate: Date;
};

type YearCalendarEmits = {
  (event: "change", date: Date): void;
};

let props = defineProps<YearCalendarProps>();

let emit = defineEmits<YearCalendarEmits>();

let { selectedDate } = toRefs(props);

let dates = computed(() => {
  let dates: Date[] = [];
  let date = new Date();

  for (let i = 0; i < 12; i++) {
    date.setMonth(i);
    dates.push(structuredClone(date));
  }

  return dates;
});
</script>

<template>
  <div :class="styles.container">
    <DatePicker
      v-for="date in dates"
      :calender-date="date"
      :selected-date="selectedDate"
      :show-arrow="false"
      :show-year="false"
      @change="(event) => emit('change', event)"
    />
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 30px;
}
</style>
