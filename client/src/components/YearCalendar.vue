<script setup lang="ts">
import { toRefs, computed, ref, watch, inject, onMounted } from "vue";
import dayjs from "dayjs";
import { toast } from "vue3-toastify";
import usePopper from "@/composables/usePopper";
import useClickOutSide from "@/composables/useClickOutSide";
import DatePicker from "@/components/DatePicker.vue";
import EventList from "./EventList.vue";
import ContextMenu from "./ContextMenu.vue";
import { getEventByDate } from "@/services/Event";
import { getDayName } from "@/utils";
import { CalendarView, EventPopUpType, EventDetail } from "@/types/Event";

type YearCalendarProps = {
  selectedDate: Date;
};

type YearCalendarEmits = {
  (event: "onChange", date: Date, view?: CalendarView): void;
};

let props = defineProps<YearCalendarProps>();

let emit = defineEmits<YearCalendarEmits>();

let { selectedDate } = toRefs(props);

let eventList = ref<EventDetail[]>([]);

let calendarContainer = ref<HTMLElement | null>(null);

let isOpen = ref(false);

let reference = ref<HTMLElement | null>(null);

let popper = ref<HTMLElement | null>(null);

let contextMenu = ref<InstanceType<typeof ContextMenu> | null>(null);

let isLoading = ref(true);

let eventPopup = inject<EventPopUpType>("eventPopup");

onMounted(() => {
  if (!eventPopup || !calendarContainer.value) return;
  eventPopup.value.container = calendarContainer.value;
});

usePopper(reference, popper, {
  placement: "bottom",
  modifiers: [
    {
      name: "offset",
      options: {
        offset: [0, 10],
      },
    },
  ],
});

let dates = computed(() => {
  let dates: Date[] = [];
  let date = structuredClone(selectedDate.value);

  for (let i = 0; i < 12; i++) {
    date.setMonth(i);
    dates.push(structuredClone(date));
  }

  return dates;
});

let getEvents = async (date: string) => {
  if (!calendarContainer.value) return;

  try {
    let element = calendarContainer.value.querySelector<HTMLElement>(
      `[data-date='${date}']`
    );

    if (element) {
      reference.value = element;
    }

    let {
      data: { data },
    } = await getEventByDate({ startDate: date, endDate: date, type: "year" });
    eventList.value = data;
  } catch (err: any) {
    toast.error(err?.message || "Error");
  } finally {
    isLoading.value = false;
  }
};

let handleChange = (value: Date) => {
  let date = dayjs(value).format("YYYY-MM-DD");
  let isViewChange =
    isOpen.value && dayjs(selectedDate.value).format("YYYY-MM-DD") === date;

  emit("onChange", value, isViewChange ? "day" : undefined);

  if (isViewChange) return;

  eventList.value = [];
  isLoading.value = true;

  if (!isOpen.value) toggle();

  getEvents(date);
};

let toggle = () => {
  isOpen.value = !isOpen.value;
};

let unRegister = useClickOutSide(popper, toggle, (event) => {
  if (!popper.value) return;

  let element = event.target as HTMLElement;

  return !popper.value.contains(element) && !element.hasAttribute("data-date");
});

watch(isOpen, (isOpen) => {
  if (!isOpen) unRegister();
});

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

let handleDelete = ({ _id }: EventDetail) => {
  let index = eventList.value.findIndex((event) => _id === event._id);
  if (index === -1) return;
  eventList.value.splice(index, 1);
};

let handleCompleted = ({ _id }: EventDetail) => {
  let index = eventList.value.findIndex((event) => _id === event._id);
  if (index === -1) return;
  eventList.value[index].completed = true;
};
</script>

<template>
  <div ref="calendarContainer" :class="styles.container">
    <DatePicker
      v-for="date in dates"
      :calender-date="date"
      :selected-date="selectedDate"
      :show-arrow="false"
      :show-year="false"
      @on-change="handleChange"
    />
    <div v-if="isOpen" ref="popper" :class="styles.popup">
      <div :class="styles.date">
        <span>{{ getDayName(selectedDate.getDay()) }}</span>
        <span :class="styles.highlight">{{ selectedDate.getDate() }}</span>
        <i class="bx-x" @click="toggle"></i>
      </div>
      <div :class="styles.events">
        <span v-if="isLoading" :class="styles.msg">Loading...</span>
        <span v-else-if="eventList.length === 0" :class="styles.msg">
          There are no events scheduled on this day.
        </span>
        <EventList
          v-else
          type="year"
          :events="eventList"
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
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 30px;
  height: 100%;
  overflow-y: auto;
  padding: 15px 10px;
}
.popup {
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%);
  padding: 15px;
  width: 250px;
  .date {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    span {
      font-family: "Poppins-Medium", sans-serif;
      &:nth-child(1) {
        color: #70757a;
      }
      &:nth-child(2) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        color: rgb(60, 64, 67);
        &:is(.highlight) {
          background-color: rgb(26, 115, 232);
          color: white;
        }
      }
    }
    i {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: -5px;
      right: 0px;
      width: 30px;
      height: 30px;
      font-size: 24px;
      border-radius: 50%;
      background-color: transparent;
      color: rgb(95, 99, 104);
      transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      &:hover {
        background-color: #f1f3f4;
      }
    }
  }
  .events {
    max-height: 154px;
    overflow-y: auto;
    margin-top: 15px;
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
    .msg {
      display: inline-block;
      text-align: center;
      font-size: 14px;
      color: rgb(60, 64, 67);
      line-height: 1.3;
    }
  }
}

@keyframes loader {
  0% {
    transform: translateX(-100px);
  }
  40% {
    transform: translateX(35%);
  }
  60% {
    transform: translateX(65%);
  }
  80% {
    transform: translateX(85%);
  }
  100% {
    transform: translateX(calc(100% + 100px));
  }
}
</style>
