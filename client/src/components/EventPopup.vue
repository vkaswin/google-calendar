<script lang="ts" setup>
import { ref, toRefs, computed, Ref } from "vue";
import usePopper from "@/composables/usePopper";
import { EventDetail } from "@/types/Calendar";
import { getMonthName } from "@/utils";
import { Validation } from "@vuelidate/core";

type EventPopupProps = {
  eventDetail: Partial<EventDetail>;
  reference: HTMLElement | null;
  formState: Validation;
};

type EventPopupEmits = {
  (event: "onSubmit"): void;
  (event: "onClose"): void;
};

let props = defineProps<EventPopupProps>();

let emit = defineEmits<EventPopupEmits>();

let { formState, reference, eventDetail } = toRefs(props);

let popper = ref<HTMLElement | null>(null);

let date = computed(() => {
  if (!eventDetail.value.date || eventDetail.value.date.length === 0) return;
  return new Date(eventDetail.value.date);
});

usePopper(reference, popper, {
  placement: "left",
  modifiers: [
    {
      name: "offset",
      options: {
        offset: [0, 5],
      },
    },
  ],
});
</script>

<template>
  <div ref="popper" :class="styles.container">
    <div :class="styles.popup">
      <div>
        <div :class="styles.title">
          <input placeholder="Add Title" v-model="eventDetail.title" />
        </div>
        <div v-if="formState?.title?.$error" :class="styles.error_msg">
          <i class="bx-error-circle"></i>
          <span>{{ formState.title?.$errors[0]?.$message }}</span>
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
        <div v-if="formState?.description?.$error" :class="styles.error_msg">
          <i class="bx-error-circle"></i>
          <span>{{ formState.description?.$errors[0].$message }}</span>
        </div>
      </div>
    </div>
    <div :class="styles.submit">
      <button @click="emit('onSubmit')">Save</button>
    </div>
    <i class="bx-x" :class="styles.close_icon" @click="emit('onClose')"></i>
  </div>
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
