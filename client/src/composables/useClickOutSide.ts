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
      document.addEventListener("click", handleClick);
      isEventAttached = true;
    }, 0);
  });

  let removeClickEvent = () => {
    if (!isEventAttached) return;
    document.removeEventListener("click", handleClick);
    isEventAttached = false;
  };

  let handleClick = (event: MouseEvent) => {
    if (!handler(event)) return;

    removeClickEvent();
    cb();
  };

  onUnmounted(removeClickEvent);

  return removeClickEvent;
};

export default useClickOutSide;
