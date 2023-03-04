<script setup lang="ts">
import { toRefs, computed, ref, watch, inject, onMounted } from "vue";
import DatePicker from "@/components/DatePicker.vue";
import { getDayName } from "@/utils";
import usePopper from "@/composables/usePopper";
import useClickOutSide from "@/composables/useClickOutSide";
import { EventPopUpType } from "@/types/Calendar";

type YearCalendarProps = {
  selectedDate: Date;
};

type YearCalendarEmits = {
  (event: "onChange", date: Date, changeView: boolean): void;
};

let props = defineProps<YearCalendarProps>();

let emit = defineEmits<YearCalendarEmits>();

let { selectedDate } = toRefs(props);

let calendarContainer = ref<HTMLElement | null>(null);

let isOpen = ref(false);

let reference = ref<HTMLElement | null>(null);

let popper = ref<HTMLElement | null>(null);

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

let handleChange = (date: Date) => {
  let changeView =
    selectedDate.value.toISOString().split("T")[0] ===
      date.toISOString().split("T")[0] && isOpen.value;

  emit("onChange", date, changeView);

  if (changeView) return;

  if (!isOpen.value) toggle();
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

watch(
  selectedDate,
  async (selectedDate) => {
    if (!calendarContainer.value) return;

    let element = calendarContainer.value.querySelector<HTMLElement>(
      `[data-date='${selectedDate.toLocaleDateString()}']`
    );

    if (element) {
      reference.value = element;
    }

    // api call to fetch events by date
    console.log("🚀 ~ file: YearCalendar.vue:93 ~ watch ~ date:", selectedDate);
  },
  { flush: "post" }
);
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
    </div>
  </div>
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
      transition: background-color 0.25s ease-in-out;
      cursor: pointer;
      &:hover {
        background-color: #f1f3f4;
      }
    }
  }
}
</style>
