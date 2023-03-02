<script lang="ts" setup>
import { ref, toRefs, computed, reactive, watch } from "vue";
import usePopper from "@/composables/usePopper";
import { Placement } from "@popperjs/core";
import { EventDetail } from "@/types/Calendar";
import { getMonthName } from "@/utils";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { createEvent } from "@/services/Calender";
import { toast } from "vue3-toastify";

type EventPopupProps = {
  placement?: Placement;
  reference: HTMLElement | null;
  container: HTMLElement;
};

type EventPopupEmits = {
  (event: "onNewEvent", data: EventDetail): void;
  (event: "onClose"): void;
};

let props = withDefaults(defineProps<EventPopupProps>(), { placement: "left" });

let isOpen = ref(false);

let eventDetail = reactive<EventDetail>({
  date: "",
  description: "",
  time: "",
  title: "",
});

let emit = defineEmits<EventPopupEmits>();

let { reference, placement, container } = toRefs(props);

let rules = {
  title: {
    required: helpers.withMessage("Please enter title", required),
  },
  description: {
    required: helpers.withMessage("Please enter description", required),
  },
  time: {},
  date: {},
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
  eventDetail = {
    date: "",
    description: "",
    time: "",
    title: "",
  };
};

let handleSubmit = async () => {
  try {
    let isValid = await $v.value.$validate();
    if (!isValid) return;
    let { data } = await createEvent(eventDetail);
    reset();
    emit("onNewEvent", data);
  } catch (err: any) {
    toast.error(err?.message || "Error");
  }
};

let popperInstance = usePopper(reference, popper, {
  placement: placement.value,
  modifiers: [
    {
      name: "offset",
      options: {
        offset: [0, 5],
      },
    },
  ],
});

watch(placement, (placement) => {
  popperInstance.value?.setOptions({ placement });
});

defineExpose({
  isOpen,
  eventDetail,
  openPopup,
  closePopup,
  reset,
});
</script>

<template>
  <Teleport :to="container" v-if="isOpen">
    <div ref="popper" :class="styles.container">
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
          <i class="bx-time-five"></i>
          <div v-if="eventDetail" :class="styles.wrap_field">
            <span v-if="date">{{
              ` ${getMonthName(
                date.getMonth()
              )} ${date.getDate()}, ${date.getFullYear()}`
            }}</span>
            <div :class="styles.dropdown">
              {{ eventDetail.time }}
            </div>
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
      <i class="bx-x" :class="styles.close_icon" @click="closePopup"></i>
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
      align-items: center;
      gap: 10px;
      margin: 20px 0px;
      .wrap_field {
        display: flex;
        align-items: center;
        gap: 15px;
        span {
          font-size: 14px;
        }
      }
      i {
        color: rgb(95, 99, 104);
        font-size: 24px;
      }
      span {
        color: rgb(60, 64, 67);
        font-size: 16px;
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
    transition: background-color 0.25s ease-in-out;
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
