<script lang="ts" setup>
import { toRefs, ref, watch, onMounted, onUnmounted, CSSProperties } from "vue";
import { createPopper, Instance } from "@popperjs/core";

type Option = {
  label: string;
  value: string;
};

type DropDownProps = {
  target?: string;
  options: Option[];
};

type DropDownEmits = {
  (event: "onChange", value: string): void;
};

let props = withDefaults(defineProps<DropDownProps>(), {
  options: () => [],
});

let emit = defineEmits<DropDownEmits>();

let { target, options } = toRefs(props);

let reference = ref<HTMLElement | null>(null);

let popper = ref<HTMLElement | null>(null);

let popperInstance = ref<Instance>();

let isOpen = ref(false);

onMounted(() => {
  if (!target?.value) return;

  let element = document.querySelector(target.value) as HTMLElement;

  if (!element) return;

  element.addEventListener("click", toggle);

  reference.value = element;
});

onUnmounted(() => {
  if (reference.value) {
    reference.value.removeEventListener("click", toggle);
  }
  if (popperInstance.value) {
    popperInstance.value.destroy();
  }
});

watch([reference, popper], () => {
  if (!reference.value || !popper.value || popperInstance.value) return;

  popperInstance.value = createPopper(reference.value, popper.value, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  });
});

let toggle = () => {
  isOpen.value = !isOpen.value;
};

let handleClick = (value: string) => {
  toggle();
  emit("onChange", value);
};
</script>

<template>
  <Teleport v-if="isOpen" to="body">
    <div
      ref="popper"
      :class="styles.container"
      v-bind="{
        style: { ...(popperInstance?.state?.styles?.popper) as CSSProperties },
        ...popperInstance?.state?.attributes?.popper,
      }"
    >
      <div :class="styles.menu">
        <button
          v-for="({ label, value }, index) in options"
          :key="index"
          :class="styles.item"
          @click="handleClick(value)"
        >
          {{ label }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" module="styles">
.enter {
  .menu {
    animation: fadeIn 250ms ease-in-out forwards;
  }
}
.exit {
  .menu {
    animation: fadeIn 250ms ease-in-out forwards reverse;
  }
}
.container {
  z-index: 999;
  color: #202124;
  .menu {
    display: flex;
    flex-direction: column;
    background: #fff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    width: max-content;
    border-radius: 4px;
    padding: 5px 0px;
    width: 100px;
  }
  .item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    background-color: transparent;
    border: none;
    font-size: 16px;
    color: rgb(60, 64, 67);
    cursor: pointer;
    &:hover {
      background-color: #f5f5f5;
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
