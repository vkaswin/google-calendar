<script lang="ts" setup>
import { ref, watch, Ref } from "vue";
import { toast } from "vue3-toastify";
import { VirtualElement } from "@popperjs/core";
import usePopper from "@/composables/usePopper";
import useClickOutSide from "@/composables/useClickOutSide";
import { deleteEvent, updateEvent } from "@/services/Event";
import { EventDetail } from "@/types/Event";
import { debounce } from "@/utils";

type ContextMenuEmits = {
  (name: "onCompleted", event: EventDetail): void;
  (name: "onDelete", event: EventDetail): void;
};

let emit = defineEmits<ContextMenuEmits>();

let popper = ref<HTMLElement | null>(null);
let reference = ref({
  getBoundingClientRect: () => {
    return {
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
  },
});
let eventDetail = ref<EventDetail | null>(null);

let clear = () => {
  eventDetail.value = null;
};

let handleCompleted = async () => {
  if (!eventDetail.value || !eventDetail.value._id) return;

  try {
    let {
      data: { message },
    } = await updateEvent(eventDetail.value._id, { completed: true });
    toast.success(message);
    emit("onCompleted", eventDetail.value);
    clear();
  } catch (err: any) {
    toast.error(err?.message || "Error");
  }
};

let handleDelete = async () => {
  if (!eventDetail.value || !eventDetail.value._id) return;

  try {
    let {
      data: { message },
    } = await deleteEvent(eventDetail.value._id);
    toast.success(message);
    emit("onDelete", eventDetail.value);
    clear();
  } catch (err: any) {
    toast.error(err?.message || "Error");
  }
};

usePopper(reference as Ref<VirtualElement>, popper);

let unRegister = useClickOutSide(popper, clear, (event) => {
  if (!popper.value) return;
  let element = event.target as HTMLElement;
  return !popper.value.contains(element);
});

watch(eventDetail, (eventDetail) => {
  if (!eventDetail) unRegister();
});

defineExpose({
  reference,
  eventDetail,
});
</script>

<template>
  <div v-if="eventDetail" ref="popper" :class="styles.container">
    <div :class="styles.dropdown">
      <button v-if="!eventDetail.completed" @click="handleCompleted">
        <i class="bx-check"></i>
        <span>Mark completed</span>
      </button>
      <button @click="handleDelete">
        <i class="bx-trash"></i>
        <span>Delete</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 999;
  color: #202124;
  width: 165px;
  .dropdown {
    display: flex;
    flex-direction: column;
    background: #fff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    padding: 5px 0px;
    button {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 10px;
      background-color: transparent;
      border: none;
      font-size: 16px;
      color: rgb(60, 64, 67);
      cursor: pointer;
      i {
        font-size: 18px;
      }
      span {
        font-size: 14px;
      }
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
