<script setup lang="ts">
import { toRefs, computed, ref, watch, CSSProperties } from "vue";
import { createPopper, Instance } from "@popperjs/core";
import DatePicker from "@/components/DatePicker.vue";
import { getDayName } from "@/utils";

type YearCalendarProps = {
  selectedDate: Date;
};

type YearCalendarEmits = {
  (event: "onChange", date: Date, changeView: boolean): void;
};

let props = defineProps<YearCalendarProps>();

let emit = defineEmits<YearCalendarEmits>();

let { selectedDate } = toRefs(props);

let isOpen = ref(false);

let popper = ref<HTMLElement | null>(null);

let calendar = ref<HTMLElement | null>(null);

let reference = ref<Element | null>(null);

let popperInstance = ref<Instance | null>(null);

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
    date.toISOString().split("T")[0];

  emit("onChange", date, changeView);

  if (changeView || !calendar.value) return;

  if (!isOpen.value) {
    isOpen.value = true;
  }

  let element = calendar.value.querySelector(
    `[data-date='${date.toLocaleDateString()}']`
  );

  if (!element) return;

  reference.value = element;
};

let closePopup = () => {
  isOpen.value = false;
};

watch([reference, popper], ([reference, popper]) => {
  if (!reference || !popper) return;

  if (popperInstance.value) {
    popperInstance.value.state.elements.reference = reference;
    popperInstance.value.update();
  } else {
    popperInstance.value = createPopper(reference, popper, {
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
  }
});
</script>

<template>
  <div ref="calendar" :class="styles.container">
    <DatePicker
      v-for="date in dates"
      :calender-date="date"
      :selected-date="selectedDate"
      :show-arrow="false"
      :show-year="false"
      @on-change="handleChange"
    />
    <div
      v-if="isOpen"
      ref="popper"
      :class="styles.popup"
      v-bind="{
        style: { ...(popperInstance?.state?.styles?.popper) as CSSProperties },
        ...popperInstance?.state?.attributes?.popper,
      }"
    >
      <div :class="styles.date">
        <span>{{ getDayName(selectedDate.getDay()) }}</span>
        <span :class="styles.highlight">{{ selectedDate.getDate() }}</span>
        <i class="bx-x" @click="closePopup"></i>
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
      width: 25px;
      height: 25px;
      font-size: 24px;
      border-radius: 50%;
      background-color: transparent;
      color: rgb(95, 99, 104);
      transition: background-color 0.25s ease-in-out;
      cursor: pointer;
      &:hover {
        background-color: #f9f9f9;
      }
    }
  }
}
</style>
