<script setup lang="ts">
import {
  toRefs,
  watch,
  ref,
  computed,
  onMounted,
  onUnmounted,
  useCssModule,
  inject,
  watchEffect,
} from "vue";
import dayjs from "dayjs";
import { toast } from "vue3-toastify";
import EventList from "./EventList.vue";
import ContextMenu from "./ContextMenu.vue";
import { getEventByDate } from "@/services/Event";
import { timeSlots } from "@/utils";
import {
  CalendarView,
  EventPopUpType,
  DateParams,
  EventDetail,
  EventByDateAndTime,
} from "@/types/Event";

type WeekCalendarProps = {
  selectedDate: Date;
  view: CalendarView;
};

type WeekCalendarEmits = {
  (event: "onChange", date: Date, view: CalendarView): void;
};

let props = defineProps<WeekCalendarProps>();

let emit = defineEmits<WeekCalendarEmits>();

let eventPopup = inject<EventPopUpType>("eventPopup");

let styles = useCssModule("styles");

let { view, selectedDate } = toRefs(props);

let calendarContainer = ref<HTMLElement | null>(null);

let indicator = ref<HTMLDivElement>();

let eventList = ref<EventByDateAndTime>({});

let contextMenu = ref<InstanceType<typeof ContextMenu> | null>(null);

let intervalId: ReturnType<typeof setInterval>;

let columns = computed(() => (view.value === "week" ? 7 : 1));

let timeSlotWidth = "65px";

let slotHeight = "60px";

let dates = computed(() => {
  let dates: Date[] = [];
  let date = structuredClone(selectedDate.value);

  dates.push(structuredClone(date));

  if (view.value === "week") {
    for (let i = date.getDay(); i < 6; i++) {
      date.setDate(date.getDate() + 1);
      dates.push(structuredClone(date));
    }

    date = structuredClone(selectedDate.value);

    for (let i = selectedDate.value.getDay(); i > 0; i--) {
      date.setDate(date.getDate() - 1);
      dates.unshift(structuredClone(date));
    }
  }

  return dates;
});

let getEvents = async (params: DateParams) => {
  try {
    let {
      data: { data },
    } = await getEventByDate({ ...params, type: "week" });

    let events = data.reduce((obj, { date, events, time }) => {
      if (obj[date]) {
        if (obj[date][time]) {
          obj[date][time] = obj[date][time]?.concat(events);
        } else {
          obj[date][time] = events;
        }
      } else {
        obj[date] = {
          [time]: events,
        };
      }
      return obj;
    }, {} as any) as EventByDateAndTime;

    eventList.value = events;
  } catch (err: any) {
    toast.error(err?.message || "Error");
  }
};

watchEffect(() => {
  let startDate = dayjs(dates.value[0]).format("YYYY-MM-DD");
  let endDate = dayjs(dates.value[dates.value.length - 1]).format("YYYY-MM-DD");
  getEvents({ startDate, endDate });
});

watchEffect(() => {
  if (!eventPopup?.value) return;
  eventPopup.value.placement = view.value === "day" ? "bottom" : "left";
});

let handleNewEvent = (event: EventDetail) => {
  if (eventList.value[event.date]) {
    let events = eventList.value[event.date][event.time!];
    if (events) {
      events.push(event);
    } else {
      eventList.value[event.date][event.time!] = [event];
    }
  } else {
    if (!eventList.value[event.date]) {
      eventList.value[event.date] = {};
    }
    eventList.value[event.date][event.time!] = [event];
  }
};

onMounted(() => {
  window.addEventListener("resize", handleIndicator);
  handleIndicator();
  intervalId = setInterval(updateIndicatorPosition, 60000);

  if (!eventPopup || !calendarContainer.value) return;

  eventPopup.value.container = calendarContainer.value;
  eventPopup.value.handleNewEvent = handleNewEvent;
});

const updateIndicatorPosition = () => {
  if (!indicator.value) return;
  let date = new Date();
  let height = parseInt(slotHeight.replace("px", ""));
  let top = date.getHours() * height + date.getMinutes();
  indicator.value.style.top = `${top}px`;
};

let updateIndicatorDimension = () => {
  let container = document.querySelector<HTMLDivElement>(
    `.${styles.time_slot_container}`
  );

  if (!container) return;

  let element = document.querySelector<HTMLDivElement>(`.${styles.highlight}`);

  if (!element || !indicator.value) return;

  indicator.value.style.left =
    view.value === "week"
      ? `${
          element.getBoundingClientRect().left -
          container.getBoundingClientRect().left
        }px`
      : timeSlotWidth;

  indicator.value.style.width =
    view.value === "week"
      ? `${element.clientWidth}px`
      : `calc(100% - ${timeSlotWidth})`;
};

const handleIndicator = () => {
  updateIndicatorDimension();
  updateIndicatorPosition();
};

watch(
  [view, selectedDate],
  () => {
    handleIndicator();
  },
  { flush: "post" }
);

onUnmounted(() => {
  window.removeEventListener("resize", handleIndicator);
  clearInterval(intervalId);
});

let handleEvent = (value: Date, time: number) => {
  if (!calendarContainer.value) return;

  let date = dayjs(value).format("YYYY-MM-DD");
  let element = calendarContainer.value.querySelector(
    `[data-date='${date}'][data-time='${time}']`
  ) as HTMLElement;

  if (!eventPopup?.value) return;

  eventPopup.value.reference = element;
  eventPopup.value.eventDetail.date = date;
  eventPopup.value.eventDetail.time = time;

  if (!eventPopup.value.isOpen) eventPopup.value.openPopup();
};

let handleViewChange = (date: Date) => {
  if (view.value === "week") emit("onChange", date, "day");
};

let handleViewEvent = (event: EventDetail) => {
  console.log(
    "🚀 ~ file: WeekCalendar.vue:203 ~ handleViewEvent ~ event:",
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

let handleDelete = ({ _id, time, date }: EventDetail) => {
  let events = eventList.value[date][time!];
  if (!events) return;
  let index = events.findIndex((event) => _id === event._id);
  if (index === -1) return;
  events.splice(index, 1);
};

let handleCompleted = ({ _id, time, date }: EventDetail) => {
  let events = eventList.value[date][time!];
  if (!events) return;
  let index = events.findIndex((event) => _id === event._id);
  if (index === -1) return;
  events[index].completed = true;
};
</script>

<template>
  <div :class="styles.container" :data-view="view">
    <div :class="styles.week_section">
      <div :class="styles.title">
        <span>GMT+05:30</span>
      </div>
      <div
        v-for="(date, index) in dates"
        :key="index"
        :class="[
          styles.week,
          dayjs().format('YYYY-MM-DD') === dayjs(date).format('YYYY-MM-DD') &&
            styles.highlight,
        ]"
        @click="handleViewChange(date)"
      >
        <span>{{ dayjs(date).format("ddd") }}</span>
        <span>{{ date.getDate() }}</span>
      </div>
      <div></div>
    </div>
    <div :class="styles.divider"></div>
    <div ref="calendarContainer" :class="styles.time_slot_section">
      <div
        :class="styles.time_slot_container"
        v-for="({ label, time }, index) in timeSlots"
        :key="index"
      >
        <div :class="styles.time">
          <span v-if="index !== 0">{{ label }}</span>
        </div>
        <div
          :class="styles.date_slot"
          v-for="column in columns"
          :key="column"
          :data-date="dayjs(dates[column - 1]).format('YYYY-MM-DD')"
          :data-time="index"
          @click="handleEvent(dates[column - 1], index)"
        >
          <EventList
            v-if="
              eventList[dayjs(dates?.[column - 1])?.format('YYYY-MM-DD')]?.[
                index
              ]
            "
            type="week"
            :events="
              eventList[dayjs(dates[column - 1]).format('YYYY-MM-DD')][index]
            "
            @on-click="handleViewEvent"
            @on-context-menu="handleContextMenu"
          />
          <div
            v-if="
              eventPopup?.isOpen &&
              eventPopup?.eventDetail.date ===
                dayjs(dates[column - 1]).format('YYYY-MM-DD') &&
              eventPopup?.eventDetail.time == index
            "
            :class="styles.event_card"
          >
            <span>{{ eventPopup?.eventDetail.title || "(No Title)" }}</span>
            <span>{{ time }}</span>
          </div>
        </div>
      </div>
      <div
        ref="indicator"
        v-show="
          dates.some(
            (date) =>
              dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
          )
        "
        :class="styles.indicator"
      ></div>
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
  height: 100%;
  padding-top: 15px;
  --week-wrapper-height: 90px;
  --scrollbar-width: 8px;
  --divider-height: 1px;
  --light-gray: rgb(218, 220, 224);
  .week_section {
    display: grid;
    grid-template-columns: v-bind(timeSlotWidth) repeat(7, 1fr) var(
        --scrollbar-width
      );
    height: var(--week-wrapper-height);
    div:first-child {
      display: flex;
      align-items: flex-end;
      font-size: 10px;
      color: #70757a;
      padding-bottom: 5px;
    }
    .week {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      &:nth-child(2)::before {
        left: 0px;
      }
      &::before {
        content: "";
        position: absolute;
        left: -1px;
        bottom: 0px;
        height: 25px;
        width: 1px;
        background-color: var(--light-gray);
      }
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
          color: rgb(60, 64, 67);
          font-size: 14px;
        }
        &:last-child {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          color: rgb(60, 64, 67);
          font-size: 24px;
          font-family: "Poppins-Medium", sans-serif;
          transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
      }
    }
  }
  .divider {
    position: relative;
    left: 30px;
    background-color: var(--light-gray);
    height: var(--divider-height);
    width: calc(100% - 45px);
  }
  .time_slot_section {
    position: relative;
    height: calc(100% - var(--week-wrapper-height) - var(--divider-height));
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: var(--scrollbar-width);
      border-top-right-radius: 10px;
    }
    &::-webkit-scrollbar-track {
      background: white;
    }
    &::-webkit-scrollbar-thumb {
      background: #bec1c6;
      border-radius: 10px;
    }
    .time_slot_container {
      display: grid;
      grid-template-columns: v-bind(timeSlotWidth) repeat(v-bind(columns), 1fr);
      grid-auto-rows: v-bind(slotHeight);
      &:not(:first-child) {
        .time {
          &::before {
            content: "";
            position: absolute;
            top: 4px;
            right: 0px;
            width: 10px;
            height: 1px;
            background-color: var(--light-gray);
          }
        }
      }
      .time {
        position: relative;
        color: #70757a;
        font-size: 10px;
        font-family: "Poppins-Medium", sans-serif;
        margin-top: -5px;
        display: flex;
        justify-content: flex-end;
        padding-right: 15px;
        span {
          margin-top: -4px;
        }
      }
      .date_slot {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 2px;
        border-color: var(--light-gray);
        border-style: solid;
        border-width: 0px 1px 1px 0px;
        overflow-y: auto;
        padding: 2px 15px 2px 2px;
        cursor: pointer;
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
        &:nth-child(2) {
          border-width: 0px 0px 1px 1px;
        }
        .event_card {
          position: absolute;
          inset: 2px;
          background-color: rgb(3, 155, 229);
          border-color: rgb(3, 155, 229);
          box-shadow: 0px 6px 10px 0px rgb(0 0 0 / 14%),
            0px 1px 18px 0px rgb(0 0 0 / 12%), 0px 3px 5px -1px rgb(0 0 0 / 20%);
          border-radius: 4px;
          padding: 5px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          z-index: 1;
          span {
            color: white;
            &:first-child {
              font-size: 14px;
              font-family: "Poppins-Medium", sans-serif;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              word-break: break-all;
            }
            &:last-child {
              font-size: 12px;
            }
          }
        }
      }
    }
    .indicator {
      position: absolute;
      height: 2px;
      --bg-color: rgb(234, 67, 53);
      background-color: var(--bg-color);
      pointer-events: none;
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0px;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        background-color: var(--bg-color);
        border-radius: 50%;
      }
    }
  }
}

.container[data-view="week"] {
  .time_slot_section {
    .time_slot_container {
      .date_slot {
        &:nth-child(2) {
          border-width: 0px 1px 1px 1px;
        }
        &:last-child {
          border-width: 0px 0px 1px 0px;
        }
      }
    }
  }
}
</style>
