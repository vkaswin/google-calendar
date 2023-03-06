<script setup lang="ts">
import { toRefs, computed, inject, onMounted, ref, watchEffect } from "vue";
import { toast } from "vue3-toastify";
import dayjs from "dayjs";
import EventList from "./EventList.vue";
import ContextMenu from "./ContextMenu.vue";
import { getEventByDate } from "@/services/Event";
import { getAllDates, getDayName } from "@/utils";
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
    } = await getEventByDate(params);

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

onMounted(() => {
  if (!eventPopup?.value || !calendarContainer.value) return;
  eventPopup.value.container = calendarContainer.value;
});

watchEffect(() => {
  let startDate = dayjs(dates.value[0]).format("YYYY-MM-DD");
  let endDate = dayjs(dates.value[dates.value.length - 1]).format("YYYY-MM-DD");
  getEvents({ startDate, endDate, type: "month" });
});

let handleEvent = (date: Date) => {
  if (!calendarContainer.value) return;

  let element = calendarContainer.value.querySelector(
    `[data-date='${dayjs(date).format("YYYY-MM-DD")}']`
  ) as HTMLElement;

  if (!eventPopup?.value) return;

  eventPopup.value.reference = element;
  eventPopup.value.eventDetail.date = date.toISOString();

  if (!eventPopup.value.isOpen) eventPopup.value.openPopup();
};

let handleViewEvent = (event: EventDetail) => {
  console.log(
    "🚀 ~ file: MonthCalendar.vue:71 ~ handleViewEvent ~ event:",
    event
  );
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

let handleDelete = ({ _id, date }: EventDetail) => {
  let events = eventList.value[date];
  if (!events) return;
  let index = events.findIndex((event) => _id === event._id);
  if (index === -1) return;
  events.splice(index, 1);
};

let handleCompleted = ({ _id, date }: EventDetail) => {
  let events = eventList.value[date];
  if (!events) return;
  let index = events.findIndex((event) => _id === event._id);
  if (index === -1) return;
  events[index].completed = true;
};
</script>

<template>
  <div ref="calendarContainer" :class="styles.container">
    <div
      v-for="(date, index) in dates"
      :key="index"
      :class="styles.date_slot"
      :data-date="dayjs(date).format('YYYY-MM-DD')"
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
      <div :class="styles.events">
        <EventList
          v-if="eventList?.[dayjs(date).format('YYYY-MM-DD')]"
          :events="eventList?.[dayjs(date).format('YYYY-MM-DD')]"
          type="month"
          @on-click="handleViewEvent"
          @on-context-menu="handleContextMenu"
        />
      </div>
    </div>
  </div>
  <ContextMenu
    ref="contextMenu"
    @on-completed="handleCompleted"
    @on-delete="handleDelete"
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
        width: 24px;
        height: 24px;
        color: #3c4043;
        font-size: 12px;
        border-radius: 50%;
        transition: background-color 0.25ms cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        &:hover {
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
