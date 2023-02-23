<script setup lang="ts">
import { toRefs, computed } from "vue";
import { getMonthName } from "@/utils";
import SearchBar from "./SearchBar.vue";
import { User } from "@/types/user";
import { CalendarView } from "@/types/calendar";

type HeaderProps = {
  user: User | null;
  date: Date;
  view: string;
};

type HeaderEmits = {
  (event: "onReset"): void;
  (event: "onNext"): void;
  (event: "onPrevious"): void;
  (event: "onViewChange", view: CalendarView): void;
};

let props = defineProps<HeaderProps>();

let { date, user } = toRefs(props);

let emit = defineEmits<HeaderEmits>();

let userInitial = computed(() => {
  if (!user.value) return;
  let [firstName, lastName] = user.value.name.split(" ");
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.trim();
});
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.logo">
      <img src="@/assets/images/calendar.png" />
      <span>Calender</span>
    </div>
    <div :class="styles.date_wrapper">
      <button :class="styles.reset" @click="emit('onReset')">Today</button>
      <div :class="styles.date">
        <div :class="styles.icon">
          <i class="bx-chevron-left" @click="emit('onPrevious')"></i>
          <i class="bx-chevron-right" @click="emit('onNext')"></i>
        </div>
        <span>{{
          `${getMonthName(date.getMonth())} ${date.getFullYear()}`
        }}</span>
      </div>
      <!-- <button @click="emit('onViewChange', 'month')">{{ view }}</button> -->
      <select
        :value="view"
        @change="(event) => emit('onViewChange', (event.target as HTMLSelectElement).value as CalendarView)"
      >
        <option
          v-for="(title, index) in ['day', 'week', 'month', 'year']"
          :key="index"
        >
          {{ title }}
        </option>
      </select>
    </div>
    <SearchBar />
    <div :class="styles.avatar">
      <div>
        <span>{{ userInitial }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: grid;
  grid-template-columns: 0.3fr 0.8fr 1fr 0.2fr;
  align-items: center;
  align-content: center;
  gap: 15px;
  background-color: #ffffff;
  height: var(--header-height);
  padding: 0px 15px;
  border-bottom: 1px solid rgb(218, 220, 224);
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    i {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #606368;
      font-size: 28px;
      cursor: pointer;
      &:hover {
        background-color: #f0f0f0;
      }
    }
    img {
      width: 44px;
      height: 40px;
    }
    span {
      color: #3c4043;
      font-family: "Poppins-Medium", sans-serif;
      font-size: 20px;
    }
  }
  .date_wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    .reset {
      color: rgb(60, 64, 67);
      font-family: "Poppins-Medium", sans-serif;
      padding: 7px 0px;
      width: 80px;
      border: 1px solid #dadce0;
      background-color: #f9f9f9;
      border-radius: 4px;
      cursor: pointer;
    }
    .date {
      display: flex;
      align-items: center;
      gap: 10px;
      .icon {
        display: flex;
        gap: 10px;
        i {
          font-size: 28px;
          color: rgb(95, 99, 104);
          cursor: pointer;
        }
      }
      span {
        color: rgb(60, 64, 67);
        font-size: 20px;
      }
    }
  }
  .avatar {
    display: flex;
    justify-content: flex-end;
    div {
      position: relative;
      background-color: #4d8ff7;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      cursor: pointer;
      span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 18px;
      }
    }
  }
}
</style>
