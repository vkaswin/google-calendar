<script lang="ts" setup>
import { ref, computed, reactive, watch, toRefs } from "vue";
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { toast } from "vue3-toastify";
import dayjs from "dayjs";
import usePopper from "@/composables/usePopper";
import TimeSlot from "./TimeSlot.vue";
import { createEvent } from "@/services/Event";
import { CalendarView, EventDetail } from "@/types/Event";

type EventPopupProps = {
  view: CalendarView;
};

let props = defineProps<EventPopupProps>();

let { view } = toRefs(props);

let isOpen = ref(false);

let eventDetail = reactive<EventDetail>({
  date: "",
  description: "",
  time: NaN,
  title: "",
});

let rules = {
  title: {
    required: helpers.withMessage("Please enter title", required),
  },
  description: {
    required: helpers.withMessage("Please enter description", required),
  },
  time: {
    required: helpers.withMessage("Please select any time", required),
  },
};

let placement = ref<"left" | "bottom">(
  view.value === "day" ? "bottom" : "left"
);
let container = ref<HTMLElement | null>(null);

let reference = ref<HTMLElement | null>(null);

let handleNewEvent = ref<((event: EventDetail) => void) | undefined>(undefined);

let options = {
  placement: placement.value,
  modifiers: [
    {
      name: "offset",
      options: {
        offset: [0, 5],
      },
    },
  ],
};

const $v = useVuelidate(rules, eventDetail);

let popper = ref<HTMLElement | null>(null);

let date = computed(() => {
  if (!eventDetail.date || eventDetail.date.length === 0) return;
  return new Date(eventDetail.date);
});

let openPopup = () => {
  isOpen.value = true;
};

let closePopup = () => {
  isOpen.value = false;
};

let reset = () => {
  closePopup();
  eventDetail.date = "";
  eventDetail.description = "";
  eventDetail.time = NaN;
  eventDetail.title = "";
  $v.value.$reset();
};

let handleSubmit = async () => {
  try {
    let isValid = await $v.value.$validate();
    if (!isValid) return;
    let {
      data: { message, data },
    } = await createEvent({ ...eventDetail });
    reset();
    handleNewEvent.value?.(data);
    toast.success(message);
  } catch (err: any) {
    toast.error(err?.message || "Error");
  }
};

let popperInstance = usePopper(reference, popper, options);

watch(placement, (placement) => {
  if (popperInstance.value) {
    popperInstance.value.setOptions({ placement });
  } else {
    options.placement = placement;
  }
});

let handleTimeChange = (time: number) => {
  if (view.value !== "day" && view.value !== "week") return;

  let date = new Date(eventDetail.date);
  let element = container.value?.querySelector<HTMLElement>(
    `[data-date='${dayjs(date).format("YYYY-MM-DD")}'][data-time='${time}']`
  );

  if (!element) return;

  reference.value = element;
  element?.scrollIntoView({ behavior: "smooth", inline: "center" });
};

defineExpose({
  isOpen,
  reference,
  placement,
  container,
  eventDetail,
  reset,
  openPopup,
  closePopup,
  handleNewEvent,
});
</script>

<template>
  <Teleport :to="container || 'body'" v-if="isOpen">
    <div
      ref="popper"
      :class="[styles.container, !reference && styles.align_center]"
    >
      <div :class="styles.popup">
        <div>
          <div :class="styles.title">
            <input placeholder="Add Title" v-model="eventDetail.title" />
          </div>
          <div v-if="$v.title?.$error" :class="styles.error_msg">
            <i class="bx-error-circle"></i>
            <span>{{ $v.title?.$errors[0]?.$message }}</span>
          </div>
        </div>
        <div :class="styles.date">
          <div>
            <i class="bx-time-five"></i>
            <div v-if="eventDetail">
              <span v-if="date">{{ dayjs(date).format("MMMM D, YYYY") }}</span>
              <div :class="styles.dropdown">
                <TimeSlot
                  v-model="eventDetail.time"
                  :defaultValue="eventDetail.time"
                  @update:modelValue="handleTimeChange"
                />
              </div>
            </div>
          </div>
          <div v-if="$v.time?.$error" :class="styles.error_msg">
            <i class="bx-error-circle"></i>
            <span>{{ $v.time?.$errors[0]?.$message }}</span>
          </div>
        </div>
        <div :class="styles.description">
          <textarea
            placeholder="Add description"
            v-model="eventDetail.description"
          ></textarea>
          <div v-if="$v.description?.$error" :class="styles.error_msg">
            <i class="bx-error-circle"></i>
            <span>{{ $v.description?.$errors[0].$message }}</span>
          </div>
        </div>
      </div>
      <div :class="styles.submit">
        <button @click="handleSubmit">Save</button>
      </div>
      <i class="bx-x" :class="styles.close_icon" @click="reset"></i>
    </div>
  </Teleport>
</template>

<style lang="scss" module="styles">
.container {
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: #fff;
  box-shadow: 0 24px 38px 3px rgb(0 0 0 / 14%), 0 9px 46px 8px rgb(0 0 0 / 12%),
    0 11px 15px -7px rgb(0 0 0 / 20%);
  border-radius: 8px;
  width: 420px;
  .popup {
    display: flex;
    flex-direction: column;
    padding: 50px 30px 0px 30px;
    .title {
      position: relative;
      width: 100%;
      margin-bottom: 5px;
      &::after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0px;
        background-color: #1a73e8;
        height: 1px;
        width: 100%;
        opacity: 0;
        transform: scale(0);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      &:has(input:focus)::after {
        transform: scale(1);
        opacity: 1;
        height: 2px;
      }
      &::before {
        content: "";
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 100%;
        height: 1px;
        background-color: rgb(218, 220, 224);
      }
      input {
        color: #3c4043;
        font-size: 20px;
        background-color: #f8f9fa;
        border: none;
        outline: none;
        padding: 0px 10px;
        height: 35px;
        width: 100%;
      }
    }
    .date {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin: 20px 0px;
      div:first-child {
        display: flex;
        align-items: center;
        gap: 10px;
        i {
          color: rgb(95, 99, 104);
          font-size: 24px;
        }
        span {
          color: rgb(60, 64, 67);
          font-size: 16px;
        }
        div:last-child {
          display: flex;
          align-items: center;
          gap: 15px;
          span {
            font-size: 14px;
          }
        }
      }
    }
    .description {
      display: flex;
      flex-direction: column;
      gap: 5px;
      textarea {
        background-color: rgb(241, 243, 244);
        height: 90px;
        padding: 10px;
        resize: none;
        outline: none;
        border: none;
      }
    }
  }
  .submit {
    display: flex;
    justify-content: flex-end;
    padding: 15px 30px;
    margin-top: 20px;
    border-top: 1px solid rgb(218, 220, 224);
    button {
      background-color: #1a73e8;
      color: white;
      width: 80px;
      height: 36px;
      font-family: "Poppins-Medium", sans-serif;
      border: none;
      border-radius: 4px;
    }
  }
  .close_icon {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 10px;
    right: 10px;
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
  .error_msg {
    display: flex;
    gap: 5px;
    color: #d93025;
    i {
      font-size: 16px;
      margin-top: 2px;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>
