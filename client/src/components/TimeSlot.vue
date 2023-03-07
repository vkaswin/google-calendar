<script setup lang="ts">
import { toRefs } from "vue";
import { timeSlots } from "@/utils";

type TimeSlotProps = {
  defaultValue?: string;
};

type TimeSlotEmits = {
  (event: "update:modelValue", value: string): void;
};

let emit = defineEmits<TimeSlotEmits>();

let props = defineProps<TimeSlotProps>();

let { defaultValue } = toRefs(props);
</script>

<template>
  <div :class="styles.container">
    <select
      :value="defaultValue"
      @input="({ target }) => emit('update:modelValue', (target as HTMLSelectElement).value)"
    >
      <option v-for="({ time }, index) in timeSlots" :key="index" :value="time">
        {{ time }}
      </option>
    </select>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  background-color: white;
}
</style>
