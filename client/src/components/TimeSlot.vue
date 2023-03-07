<script setup lang="ts">
import { toRefs } from "vue";
import { timeSlots } from "@/utils";

type TimeSlotProps = {
  defaultValue?: number;
};

type TimeSlotEmits = {
  (event: "update:modelValue", value: number): void;
};

let emit = defineEmits<TimeSlotEmits>();

let props = defineProps<TimeSlotProps>();

let { defaultValue } = toRefs(props);
</script>

<template>
  <div :class="styles.container">
    <select
      :value="defaultValue"
      @input="({ target }) => emit('update:modelValue', parseInt((target as HTMLSelectElement).value))"
    >
      <option
        v-for="({ time }, index) in timeSlots"
        :key="index"
        :value="index"
      >
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
