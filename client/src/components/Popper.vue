<script lang="ts" setup>
import { toRefs, ref, watchPostEffect, watch } from "vue";
import { Placement } from "@popperjs/core";
import usePopper from "@/composables/usePopper";
import useClickOutSide from "@/composables/useClickOutSide";

type DropDownProps = {
  target?: string;
  className?: string;
  placement: Placement;
};

let props = withDefaults(defineProps<DropDownProps>(), {
  placement: "bottom-start",
});

let { target, className, placement } = toRefs(props);

let reference = ref<HTMLElement | null>(null);

let popper = ref<HTMLElement | null>(null);

let isOpen = ref(false);

usePopper(reference, popper, {
  placement: placement.value,
  modifiers: [
    {
      name: "offset",
      options: {
        offset: [0, 10],
      },
    },
  ],
});

watchPostEffect(() => {
  if (!target?.value) return;

  let element = document.querySelector<HTMLElement>(target.value);

  if (!element) return;

  element.addEventListener("click", toggle);

  reference.value = element;
});

let toggle = () => {
  isOpen.value = !isOpen.value;
};

watch(isOpen, (isOpen) => {
  if (!isOpen) unRegister();
});

let unRegister = useClickOutSide(popper, toggle, (event) => {
  if (!popper.value || !reference.value) return;

  let element = event.target as HTMLElement;

  return !popper.value.contains(element);
});
</script>

<template>
  <Teleport v-if="isOpen" to="body">
    <div ref="popper" :class="[styles.container, className]">
      <div :class="styles.dropdown"><slot :toggle="toggle"></slot></div>
    </div>
  </Teleport>
</template>

<style lang="scss" module="styles">
.container {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 999;
  color: #202124;
  width: fit-content;
  max-width: 240px;
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
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
