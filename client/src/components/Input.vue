<script setup lang="ts">
import { ref, toRefs, Ref } from "vue";

type InputProps = {
  label?: string;
  type?: "text" | "password" | "number" | "email" | "search";
  error?: boolean;
  errorMessage?: string | Ref<string>;
};

type InputEmits = {
  (event: "update:modelValue", value: string): void;
};

let props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  error: false,
});

let emit = defineEmits<InputEmits>();

let { label, type, error, errorMessage } = toRefs(props);

let mask = ref(true);

let handleInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <div :class="styles.container">
    <label v-if="label">{{ label }}</label>
    <div :class="styles.input_field">
      <input :type="type" @input="handleInput" />
      <div v-if="type === 'password'" :class="styles.icon">
        <i className="bx-hide" v-if="mask" @click="mask = false"></i>
        <i className="bx-show" v-else @click="mask = true"></i>
      </div>
      <span v-if="error" :class="styles.error_msg">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  label {
    font-size: 16px;
  }
  .input_field {
    position: relative;
    input {
      background-color: #f8f9fa;
      border: 1px solid #9e9e9e;
      border-radius: 4px;
      width: 100%;
      height: 35px;
      padding: 5px 10px;
      outline: none;
    }
    input[type="password"] {
      padding: 5px 10px;
    }
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .icon {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      i {
        color: #606368;
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
  .error_msg {
    display: block;
    margin-top: 5px;
    color: #da3025;
    font-size: 14px;
  }
}
</style>
