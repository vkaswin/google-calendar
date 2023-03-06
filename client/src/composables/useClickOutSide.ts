import { watch, Ref, onUnmounted } from "vue";

type UseClickOutSide = (
  element: Ref<HTMLElement | null>,
  cb: Function,
  handler: (event: MouseEvent) => boolean | undefined
) => () => void;

const useClickOutSide: UseClickOutSide = (element, cb, handler) => {
  let isEventAttached = false;

  watch(element, (element) => {
    if (!element || isEventAttached) return;
    setTimeout(() => {
      document.addEventListener("pointerdown", handlePointerDown);
      isEventAttached = true;
    }, 0);
  });

  let removeClickEvent = () => {
    if (!isEventAttached) return;
    document.removeEventListener("pointerdown", handlePointerDown);
    isEventAttached = false;
  };

  let handlePointerDown = (event: MouseEvent) => {
    if (!handler(event)) return;

    removeClickEvent();
    cb();
  };

  onUnmounted(removeClickEvent);

  return removeClickEvent;
};

export default useClickOutSide;
