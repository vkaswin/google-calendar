<script setup lang="ts">
import { toRefs, inject } from "vue";
import { timeSlots } from "@/utils";
import { EventDetail, EventPopUpType } from "@/types/Event";

type EventListProps = {
  events?: EventDetail[];
  type: "week" | "month" | "year";
};

type EventListEmits = {
  (name: "onClick", data: EventDetail): void;
  (name: "onContextMenu", event: MouseEvent, date: EventDetail): void;
};

let props = defineProps<EventListProps>();

let emit = defineEmits<EventListEmits>();

let { events } = toRefs(props);

let eventPopup = inject<EventPopUpType>("eventPopup");

let handleViewEvent = (event: EventDetail) => {
  if (!eventPopup?.value) return;

  if (!eventPopup.value.isReadOnly) eventPopup.value.isReadOnly = true;

  eventPopup.value.eventDetail._id = event._id;
  eventPopup.value.eventDetail.time = event.time;
  eventPopup.value.eventDetail.date = event.date;
  eventPopup.value.eventDetail.title = event.title;
  eventPopup.value.eventDetail.description = event.description;

  if (!eventPopup.value.isOpen) eventPopup.value.openPopup();
};
</script>

<template>
  <div
    v-for="event in events"
    :class="styles.card"
    :key="event._id"
    @click.stop="handleViewEvent(event)"
    @contextmenu.prevent="(e) => emit('onContextMenu', e, event)"
    :data-type="type"
    :data-event-id="event._id"
    tabindex="-1"
  >
    <template v-if="type === 'week'">
      <i class="bx-check-circle"></i>
      <span :class="[event.completed && styles.strike]">
        {{ event.title }}
      </span>
    </template>
    <template v-else>
      <div :class="styles.time">
        <i class="bxs-circle"></i>
        <span :class="[event.completed && styles.strike]">{{
          timeSlots[event.time].label
        }}</span>
      </div>
      <div :class="styles.title">
        <i class="bx-check-circle"></i>
        <span :class="[event.completed && styles.strike]">
          {{ event.title }}
        </span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" module="styles">
.card {
  cursor: pointer;
  span {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
    color: white;
    font-size: 12px;
  }
  .strike {
    text-decoration: line-through;
  }
}
.card[data-type="week"] {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: #4185f4;
  border-radius: 4px;
  padding: 2px 5px;
  i {
    color: white;
    font-size: 18px;
  }
}

.card[data-type="month"],
.card[data-type="year"] {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: #fff;
  border-radius: 4px;
  padding: 2px 5px;
  transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    background-color: #f1f3f4;
  }
  .time {
    display: flex;
    align-items: center;
    gap: 3px;
    span {
      display: block;
      color: rgb(60, 64, 67);
      font-size: 11px;
      min-width: 32px;
      text-transform: lowercase;
    }
    i {
      color: #4185f4;
      font-size: 11px;
    }
  }
  .title {
    display: flex;
    align-items: center;
    gap: 3px;
    span {
      color: rgb(60, 64, 67);
      font-size: 12px;
    }
    i {
      color: rgb(60, 64, 67);
      font-size: 18px;
    }
  }
}
</style>
