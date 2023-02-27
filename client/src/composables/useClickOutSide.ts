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

  let handleClick = (event: MouseEvent) => {
    console.log("click");
    let close = handler(event);

    if (!close) return;

    document.removeEventListener("click", handleClick);
    cb();
  };

  onUnmounted(() => {
    document.removeEventListener("click", handleClick);
  });
};

export default useClickOutSide;
