<script setup lang="ts">
import { toRefs } from "vue";
import { EventDetail } from "@/types/Event";

type EventListProps = {
  events?: EventDetail[];
};

type EventListEmits = {
  (event: "onClick", data: EventDetail): void;
};

let props = defineProps<EventListProps>();

let emit = defineEmits<EventListEmits>();

let { events } = toRefs(props);
</script>

<template>
  <div
    v-for="event in events"
    :class="styles.card"
    :key="event._id"
    @click.stop="emit('onClick', event)"
  >
    <i class="bx-check-circle"></i>
    <span :class="[event.completed && styles.strike]">
      {{ event.title }}
    </span>
  </div>
</template>

<style lang="scss" module="styles">
.card {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: #4185f4;
  border-radius: 4px;
  padding: 2px 5px;
  span {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
    color: white;
    font-size: 12px;
    &:is(.strike) {
      text-decoration: line-through;
    }
  }
  i {
    color: white;
    font-size: 18px;
  }
}
</style>
