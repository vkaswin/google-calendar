import { watch, Ref, onUnmounted } from "vue";

type UseClickOutSide = (
  element: Ref<HTMLElement | null>,
  cb: Function,
  handler: (event: MouseEvent) => boolean
) => void;

const useClickOutSide: UseClickOutSide = (element, cb, handler) => {
  watch(element, (element) => {
    if (!element) return;
    setTimeout(() => document.addEventListener("click", handleClick), 0);
  });

  let removeClickEvent = () => {
    document.removeEventListener("click", handleClick);
  };

  let handleClick = (event: MouseEvent) => {
    let close = handler(event);

    if (!close) return;

    removeClickEvent();
    cb();
  };

  onUnmounted(removeClickEvent);
};

export default useClickOutSide;
