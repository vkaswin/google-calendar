<script setup lang="ts">
import { toRefs, computed, ref } from "vue";
import { getAllDates, getDayName } from "@/utils";
import EventPopup from "./EventPopup.vue";
import { EventDetail } from "@/types/Calendar";

type MonthCalendarProps = {
  selectedDate: Date;
};

type MonthCalendarEmits = {
  (event: "onChange", date: Date): void;
};

let props = defineProps<MonthCalendarProps>();

let emit = defineEmits<MonthCalendarEmits>();

let { selectedDate } = toRefs(props);

let calendarContainer: HTMLElement;

let eventPopup = ref<InstanceType<typeof EventPopup>>();

let reference = ref<HTMLElement | null>(null);

let dates = computed(() => getAllDates(selectedDate.value));

let handleEvent = (date: Date) => {
  let element = calendarContainer.querySelector(
    `[data-date='${date.toLocaleDateString()}']`
  ) as HTMLElement;

  reference.value = element;

  if (eventPopup.value?.eventDetail) {
    eventPopup.value.eventDetail.date = date.toISOString();
    // eventPopup.value.eventDetail.time = time;
  }

  if (!eventPopup.value?.isOpen) eventPopup.value?.openPopup();
};

let handleNewEvent = (data: EventDetail) => {
  console.log(data);
};
</script>

<template>
  <div ref="calendarContainer" :class="styles.container">
    <div
      v-for="(date, index) in dates"
      :key="index"
      :class="styles.date_box"
      :data-date="date.toLocaleDateString()"
      @click="handleEvent(date)"
    >
      <div :class="styles.header">
        <span v-if="index <= 6" :class="styles.week">{{
          getDayName(date.getDay())
        }}</span
        ><span :class="styles.day" @click.stop="emit('onChange', date)">{{
          date.getDate()
        }}</span>
      </div>
    </div>
  </div>
  <EventPopup
    ref="eventPopup"
    :container="calendarContainer"
    :reference="reference"
    @on-new-event="handleNewEvent"
  />
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
    cursor: pointer;
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
