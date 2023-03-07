<script lang="ts" setup>
import { toRefs, ref, inject } from "vue";
import dayjs from "dayjs";
import DatePicker from "@/components/DatePicker.vue";
import { CalendarView, EventPopUpType } from "@/types/Event";

type SideBarProps = {
  view: CalendarView;
  selectedDate: Date;
};

type SideBarEmits = {
  (event: "onChange", date: Date): void;
};

let props = defineProps<SideBarProps>();

let emit = defineEmits<SideBarEmits>();

let { selectedDate, view } = toRefs(props);

let datePicker = ref<InstanceType<typeof DatePicker>>();

let eventPopup = inject<EventPopUpType>("eventPopup");

let handlePopup = () => {
  if (!eventPopup) return;

  let element: HTMLElement;
  let date = dayjs(selectedDate.value).format("YYYY-MM-DD");
  if (view.value === "week" || view.value === "day") {
    let time = new Date().getHours();
    eventPopup.value.eventDetail.time = time;
    element = eventPopup.value.container?.querySelector(
      `[data-date='${date}'][data-time='${time}']`
    ) as HTMLElement;
  } else {
    element = eventPopup.value.container?.querySelector(
      `[data-date='${date}']`
    ) as HTMLElement;
  }

  eventPopup.value.eventDetail.date = date;
  eventPopup.value.reference = element;
  eventPopup.value.openPopup();
  element.scrollIntoView({ behavior: "smooth", inline: "center" });
};

defineExpose({ datePicker });
</script>

<template>
  <div :class="styles.container">
    <button
      :class="styles.create_btn"
      @click="handlePopup"
      :disabled="eventPopup?.isOpen"
    >
      <svg viewBox="0 0 36 36">
        <path fill="#34A853" d="M16 16v14h4V20z"></path>
        <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
        <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
        <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
        <path fill="none" d="M0 0h36v36H0z"></path>
      </svg>
      <span>Create</span>
    </button>
    <DatePicker
      ref="datePicker"
      :selected-date="selectedDate"
      @on-change="(date) => emit('onChange', date)"
    />
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: var(--sidebar-width);
  padding: 15px 10px;
  overflow-y: auto;
  .create_btn {
    display: flex;
    align-items: center;
    gap: 7px;
    background-color: rgba(255, 255, 255, 0.502);
    box-shadow: 0px 1px 2px 0px rgba(60, 64, 67, 0.3),
      0px 1px 3px 1px rgba(60, 64, 67, 0.15);
    min-height: 48px;
    width: 130px;
    border-radius: 25px;
    padding: 0px 15px;
    border: none;
    cursor: pointer;
    &:disabled {
      opacity: 0.7;
      cursor: default;
    }
    &:hover:not(:disabled) {
      box-shadow: 0px 4px 4px 0px rgba(60, 64, 67, 0.3),
        0px 8px 12px 6px rgba(60, 64, 67, 0.15);
      background-color: #f6fafe;
    }
    svg {
      width: 36px;
      height: 36px;
    }
    span {
      color: #3d4043;
    }
  }
}
</style>
