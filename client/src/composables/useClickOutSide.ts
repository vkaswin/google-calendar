import { ref, watch, Ref } from "vue";

type UseClickOutSide = (
  reference: Ref<HTMLElement | null>,
  popper: Ref<HTMLElement | null>,
  cb: (event: MouseEvent) => boolean
) => void;

const useClickOutSide: UseClickOutSide = (reference, popper, cb) => {
  let isEventAdded = ref(false);

  watch([reference, popper], ([reference, popper]) => {
    if (!reference || !popper || isEventAdded.value) return;
    isEventAdded.value = true;
    setTimeout(() => document.addEventListener("click", handleClick), 0);
  });

  let handleClick = (event: MouseEvent) => {
    if (!popper.value || !reference.value) return;

    let close = cb(event);

    if (!close) return;

    isEventAdded.value = false;
    document.removeEventListener("click", handleClick);
  };
};

export default useClickOutSide;
