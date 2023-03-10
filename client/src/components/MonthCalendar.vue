<script setup lang="ts">
import { toRefs, computed, inject, onMounted, ref, watchEffect } from "vue";
import { toast } from "vue3-toastify";
import dayjs from "dayjs";
import EventList from "./EventList.vue";
import ContextMenu from "./ContextMenu.vue";
import { getEventByDate } from "@/services/Event";
import { getAllDates } from "@/utils";
import {
  EventPopUpType,
  DateParams,
  EventByDate,
  EventDetail,
} from "@/types/Event";

type MonthCalendarProps = {
  selectedDate: Date;
};

type MonthCalendarEmits = {
  (event: "onChange", date: Date): void;
};

let props = defineProps<MonthCalendarProps>();

let emit = defineEmits<MonthCalendarEmits>();

let { selectedDate } = toRefs(props);

let eventList = ref<EventByDate>({});

let calendarContainer = ref<HTMLElement | null>(null);

let eventPopup = inject<EventPopUpType>("eventPopup");

let contextMenu = ref<InstanceType<typeof ContextMenu> | null>(null);

let dates = computed(() => getAllDates(selectedDate.value));

let getEvents = async (params: DateParams) => {
  try {
    let {
      data: { data },
    } = await getEventByDate({ ...params, type: "month" });

    let events = data.reduce((obj, { date, events }) => {
      if (obj[date]) {
        obj[date] = obj[date].concat(events);
      } else {
        obj[date] = events;
      }
      return obj;
    }, {} as any);

    eventList.value = events as EventByDate;
  } catch (err: any) {
    toast.error(err?.message || "Error");
  }
};

let handleNewEvent = (event: EventDetail) => {
  let events = eventList.value[event.date];

  if (events) {
    events.push(event);
  } else {
    eventList.value[event.date] = [event];
  }
};

let handleDeleteEvent = ({ _id, date }: EventDetail) => {
  let events = eventList.value[date];
  if (!events) return;
  let index = events.findIndex((event) => _id === event._id);
  if (index === -1) return;
  events.splice(index, 1);
};

let handleUpdateEvent = (event: EventDetail) => {
  let events = eventList.value[event.date];
  if (!events) return;
  let index = events.findIndex(({ _id }) => _id === event._id);
  if (index === -1) return;
  events[index] = { ...events[index], ...event };
};

let handleClickDate = (date: string) => {
  if (!eventPopup?.value) return;

  eventPopup.value.eventDetail.date = date;

  if (eventPopup.value.isReadOnly) eventPopup.value.isReadOnly = false;

  if (!eventPopup.value.isOpen) eventPopup.value.openPopup();
};

let handleContextMenu = ({ x, y }: MouseEvent, event: EventDetail) => {
  if (!contextMenu.value) return;

  if (eventPopup?.value.isOpen) eventPopup.value.reset();

  contextMenu.value.reference = {
    getBoundingClientRect: () => {
      return {
        width: 0,
        height: 0,
        top: y,
        right: x,
        bottom: y,
        left: x,
      };
    },
  };

  contextMenu.value.eventDetail = event;
};

let handleCompletedEvent = ({ _id, date }: EventDetail) => {
  let events = eventList.value[date];
  if (!events) return;
  let index = events.findIndex((event) => _id === event._id);
  if (index === -1) return;
  events[index].completed = true;
};

watchEffect(() => {
  let startDate = dayjs(dates.value[0]).format("YYYY-MM-DD");
  let endDate = dayjs(dates.value[dates.value.length - 1]).format("YYYY-MM-DD");
  getEvents({ startDate, endDate });
});

onMounted(() => {
  if (!eventPopup?.value || !calendarContainer.value) return;
  eventPopup.value.container = calendarContainer.value;
  eventPopup.value.handleNewEvent = handleNewEvent;
  eventPopup.value.handleDeleteEvent = handleDeleteEvent;
  eventPopup.value.handleUpdateEvent = handleUpdateEvent;
});
</script>

<template>
  <div ref="calendarContainer" :class="styles.container">
    <div
      v-for="(date, index) in dates"
      :key="index"
      :class="styles.date_slot"
      :data-date="dayjs(date).format('YYYY-MM-DD')"
      @click="handleClickDate(dayjs(date).format('YYYY-MM-DD'))"
    >
      <div :class="styles.header">
        <span v-if="index <= 6" :class="styles.week">{{
          dayjs(date).format("ddd")
        }}</span
        ><span
          :class="[
            styles.day,
            dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
              ? styles.highlight
              : dayjs(date).format('YYYY-MM-DD') ===
                  dayjs(selectedDate).format('YYYY-MM-DD') && styles.active,
            ,
          ]"
          @click.stop="emit('onChange', date)"
          >{{ date.getDate() }}</span
        >
      </div>
      <div :class="styles.events">
        <EventList
          v-if="eventList?.[dayjs(date).format('YYYY-MM-DD')]"
          :events="eventList?.[dayjs(date).format('YYYY-MM-DD')]"
          type="month"
          @on-context-menu="handleContextMenu"
        />
      </div>
    </div>
  </div>
  <ContextMenu
    ref="contextMenu"
    @on-completed="handleCompletedEvent"
    @on-delete="handleDeleteEvent"
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
  .date_slot {
    --header-height: 24px;
    border-style: solid;
    border-color: rgb(218, 220, 224);
    border-width: 1px 1px 0px 0px;
    padding: 5px 0px;
    min-height: 100%;
    cursor: pointer;
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6),
    &:nth-child(7) {
      border-width: 0px 1px 0px 0px;
      --header-height: 40px;
    }
    .header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: var(--header-height);
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
        min-width: 24px;
        min-height: 24px;
        color: #3c4043;
        font-size: 12px;
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
    }
    .events {
      display: flex;
      flex-direction: column;
      gap: 2px;
      height: calc(100% - var(--header-height));
      overflow-y: auto;
      padding: 5px;
      &::-webkit-scrollbar {
        width: 5px;
        border-top-right-radius: 10px;
      }
      &::-webkit-scrollbar-track {
        background: white;
      }
      &::-webkit-scrollbar-thumb {
        background: #bec1c6;
        border-radius: 10px;
      }
    }
  }
}
</style>
