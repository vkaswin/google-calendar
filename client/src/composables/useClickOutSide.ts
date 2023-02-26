import { onMounted, ref } from "vue";

type UseClickOutSide = () => void;

const useClickOutSide: UseClickOutSide = () => {
  onMounted(() => {
    // console.log("mounted");
  });
};

export default useClickOutSide;
