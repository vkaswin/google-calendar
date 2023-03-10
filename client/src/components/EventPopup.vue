<script lang="ts" setup>
import { ref, reactive, watch, toRefs } from "vue";
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { toast } from "vue3-toastify";
import dayjs from "dayjs";
import usePopper from "@/composables/usePopper";
import { createEvent, deleteEvent, updateEvent } from "@/services/Event";
import { timeSlots } from "@/utils";
import { CalendarView, EventDetail } from "@/types/Event";

type EventPopupProps = {
  view: CalendarView;
};

let props = defineProps<EventPopupProps>();

let { view } = toRefs(props);

let isOpen = ref(false);

let isReadOnly = ref(false);

let eventDetail = reactive<EventDetail>({
  _id: undefined,
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
    valid: helpers.withMessage(
      "Please select any time",
      (val: any) => !isNaN(val)
    ),
  },
};

let placement = ref<"left" | "bottom">(
  view.value === "day" ? "bottom" : "left"
);
let container = ref<HTMLElement | null>(null);

let reference = ref<HTMLElement | null>(null);

let handleNewEvent = ref<((event: EventDetail) => void) | undefined>(undefined);

let handleDeleteEvent = ref<((id: EventDetail) => void) | undefined>(undefined);

let handleUpdateEvent = ref<((id: EventDetail) => void) | undefined>(undefined);

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

let popperInstance = usePopper(reference, popper, options);

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
  eventDetail._id = undefined;
  $v.value.$reset();
};

let handleSubmit = async () => {
  try {
    let isValid = await $v.value.$validate();

    if (!isValid) return;

    let {
      data: { data },
    } = eventDetail._id
      ? await updateEvent(eventDetail._id, eventDetail)
      : await createEvent(eventDetail);

    eventDetail._id
      ? handleUpdateEvent.value?.(eventDetail)
      : handleNewEvent.value?.(data);

    reset();
  } catch (err: any) {
    toast.error(err?.message || "Error");
  }
};

let handleDelete = async () => {
  if (!eventDetail._id) return;

  try {
    await deleteEvent(eventDetail._id);
    handleDeleteEvent.value?.(eventDetail);
    reset();
  } catch (err: any) {
    toast.error(err?.message || "Error");
  }
};

let handleEdit = () => {
  isReadOnly.value = false;
};

watch(placement, (placement) => {
  if (popperInstance.value) {
    popperInstance.value.setOptions({ placement });
  } else {
    options.placement = placement;
  }
});

defineExpose({
  isOpen,
  isReadOnly,
  reference,
  placement,
  container,
  eventDetail,
  reset,
  openPopup,
  closePopup,
  handleNewEvent,
  handleDeleteEvent,
  handleUpdateEvent,
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
            <span v-if="isReadOnly">{{ eventDetail.title }}</span>
            <input v-else placeholder="Add Title" v-model="eventDetail.title" />
          </div>
          <div v-if="$v.title?.$error" :class="styles.error_msg">
            <i class="bx-error-circle"></i>
            <span>{{ $v.title?.$errors[0]?.$message }}</span>
          </div>
        </div>
        <div :class="styles.date">
          <div>
            <i class="bx-time-five"></i>
            <div>
              <template v-if="isReadOnly || eventDetail._id">
                <span>{{
                  dayjs(eventDetail.date).format("MMMM D, YYYY")
                }}</span>
                <span :class="styles.time">{{
                  timeSlots[eventDetail.time].time
                }}</span>
              </template>
              <template v-else>
                <input id="date-field" type="date" v-model="eventDetail.date" />
                <select v-model="eventDetail.time">
                  <option disabled :value="NaN">Select time</option>
                  <option
                    v-for="({ time }, index) in timeSlots"
                    :key="index"
                    :value="index"
                  >
                    {{ time }}
                  </option>
                </select>
              </template>
            </div>
          </div>
          <div v-if="$v.time?.$error" :class="styles.error_msg">
            <i class="bx-error-circle"></i>
            <span>{{ $v.time?.$errors[0]?.$message }}</span>
          </div>
        </div>
        <div :class="styles.description">
          <span v-if="isReadOnly">{{ eventDetail.description }}</span>
          <textarea
            v-else
            placeholder="Add description"
            v-model="eventDetail.description"
          ></textarea>
          <div v-if="$v.description?.$error" :class="styles.error_msg">
            <i class="bx-error-circle"></i>
            <span>{{ $v.description?.$errors[0].$message }}</span>
          </div>
        </div>
      </div>
      <div v-if="!isReadOnly" :class="styles.submit">
        <button @click="handleSubmit">Save</button>
      </div>
      <div :class="styles.icons">
        <template v-if="isReadOnly">
          <i class="bx-edit" @click="handleEdit"></i>
          <i class="bx-trash" @click="handleDelete"></i
        ></template>
        <i class="bx-x" @click="reset"></i>
      </div>
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
  max-width: 450px;
  width: 100%;
  .popup {
    display: flex;
    flex-direction: column;
    padding: 50px 30px 0px 30px;
    .title {
      position: relative;
      width: 100%;
      margin-bottom: 5px;
      &:has(:not(input)) {
        &::before,
        &::after {
          display: none;
        }
      }
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
      .time {
        text-transform: lowercase;
      }
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
          justify-content: space-between;
          gap: 15px;
          span {
            font-size: 14px;
          }
          input[type="date"],
          select {
            width: 50%;
            background-color: #f6f6f6;
            border: none;
            outline: none;
            padding: 0px 10px;
            height: 37px;
            font-size: 14px;
            flex-grow: 1;
          }
        }
      }
    }
    .description {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-bottom: 20px;
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
  .icons {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
    align-items: center;
    i {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 35px;
      height: 35px;
      font-size: 22px;
      border-radius: 50%;
      background-color: transparent;
      color: rgb(95, 99, 104);
      transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      &:last-child {
        font-size: 24px;
      }
      &:hover {
        background-color: #f1f3f4;
      }
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
