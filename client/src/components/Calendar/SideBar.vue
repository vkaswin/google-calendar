<script lang="ts" setup>
import { toRefs, ref } from "vue";
import DatePicker from "./DatePicker.vue";

type SideBarProps = {
  date: Date;
};

type SideBarEmits = {
  (event: "onChange", date: Date): void;
};

let props = defineProps<SideBarProps>();

let emit = defineEmits<SideBarEmits>();

let { date } = toRefs(props);

let datePicker = ref<InstanceType<typeof DatePicker>>();

defineExpose({ datePicker });
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.create_btn">
      <svg viewBox="0 0 36 36">
        <path fill="#34A853" d="M16 16v14h4V20z"></path>
        <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
        <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
        <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
        <path fill="none" d="M0 0h36v36H0z"></path>
      </svg>
      <span>Create</span>
    </div>
    <DatePicker
      ref="datePicker"
      :selected-date="date"
      @on-change="(date) => emit('onChange', date)"
    />
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: transform 0.25s ease-in-out;
  width: var(--sidebar-width);
  padding: 15px 10px;
  overflow-y: auto;
  .create_btn {
    display: flex;
    align-items: center;
    gap: 7px;
    background-color: rgba(255, 255, 255, 0.502);
    box-shadow: 0px 1px 2px 0px rgba(60, 64, 67, 0.3),
      0px 1px 3px 1px rgba(60, 64, 67, 0.15);
    height: 48px;
    width: 130px;
    border-radius: 25px;
    padding: 0px 15px;
    cursor: pointer;
    &:hover {
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
