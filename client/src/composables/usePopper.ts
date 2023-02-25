import { ref, onMounted, onUnmounted } from "vue";
import { createPopper, VirtualElement, Instance } from "@popperjs/core";

type Pop = Parameters<typeof createPopper>;

type UserPopper = (
  reference: Element | VirtualElement,
  popper: HTMLElement
) => Instance | undefined;

const usePopper: UserPopper = (reference, popper) => {
  let popperInstance = ref<Instance>();

  onMounted(() => {});

  onUnmounted(() => {});

  return popperInstance.value;
};

export default usePopper;
