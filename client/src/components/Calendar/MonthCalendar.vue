<script setup lang="ts">
import { toRefs, ref, computed } from "vue";
import { getAllDates } from "@/utils";

type MonthCalendarProps = {
  selectedDate: Date;
};

let props = defineProps<MonthCalendarProps>();

let { selectedDate } = toRefs(props);

let currentDate = ref(new Date());

let dates = computed(() => getAllDates(currentDate.value));
</script>

<template>
  <div :class="styles.container">
    <div v-for="(date, index) in dates" :class="styles.date" :key="index">
      <span>{{ date.toDateString() }}</span>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-left: 1px solid rgb(218, 220, 224);
  height: 100%;
  .date {
    border: 1px solid rgb(218, 220, 224);
  }
}
</style>
