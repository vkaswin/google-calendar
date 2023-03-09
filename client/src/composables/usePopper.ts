import { ref, watch, onUnmounted, Ref } from "vue";
import {
  createPopper,
  Instance,
  OptionsGeneric,
  Modifier,
  VirtualElement,
} from "@popperjs/core";

type UsePopper = (
  reference: Ref<HTMLElement | VirtualElement | null>,
  popper: Ref<HTMLElement | null>,
  options?: Partial<OptionsGeneric<Partial<Modifier<any, any>>>>
) => Ref<Instance | null>;

const usePopper: UsePopper = (reference, popper, options) => {
  let popperInstance = ref<Instance | null>(null);

  watch(
    [reference, popper],
    ([newReference, newPopper], [oldReference, oldPopper]) => {
      if (!newReference || !newPopper) return;

      if (popperInstance.value) {
        if (newReference !== oldReference) {
          popperInstance.value.state.elements.reference = newReference;
        }
        if (newPopper !== oldPopper) {
          popperInstance.value.state.elements.popper = newPopper;
        }
        popperInstance.value.update();
      } else {
        popperInstance.value = createPopper(newReference, newPopper, options);
      }
    },
    { flush: "post" }
  );

  onUnmounted(() => {
    if (!popperInstance.value) return;

    popperInstance.value.destroy();
  });

  return popperInstance;
};

export default usePopper;
