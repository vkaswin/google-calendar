<script setup lang="ts">
import { toRefs, computed } from "vue";
import { getMonthName } from "@/utils";
import SearchBar from "@/components/SearchBar.vue";
import Popper from "@/components/Popper.vue";
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

let options = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
] as const;

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
    <div :class="styles.date_section">
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
      <button id="view-dropdown" :class="styles.dropdown">
        <span>{{ view }}</span>
        <i class="bxs-down-arrow"></i>
      </button>
      <Popper
        :target="`.${styles.dropdown}`"
        :class-name="styles.view_btn"
        placement="bottom-start"
      >
        <button
          v-for="({ label, value }, index) in options"
          :key="index"
          :class="styles.item"
          @click="emit('onViewChange', value)"
        >
          {{ label }}
        </button>
      </Popper>
    </div>
    <SearchBar />
    <div :class="styles.avatar">
      <div id="avatar">
        <span>{{ userInitial }}</span>
      </div>
    </div>
    <Popper
      target="#avatar"
      :class-name="styles.logout_btn"
      placement="bottom-end"
    >
      <button>
        <i class="bx-log-out-circle"></i>
        <span>Logout</span>
      </button>
    </Popper>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  display: grid;
  grid-template-columns: 0.3fr 0.9fr 1fr 0.2fr;
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
    img {
      width: 44px;
      height: 40px;
    }
    span {
      color: #3c4043;
      font-family: "Poppins-Medium", sans-serif;
      font-size: 20px;
      cursor: default;
    }
  }
  .dropdown {
    width: 100px;
  }
  .date_section {
    display: grid;
    grid-template-columns: 100px 1fr 120px;
    align-items: center;
    gap: 10px;
    button {
      color: rgb(60, 64, 67);
      font-family: "Poppins-Medium", sans-serif;
      padding: 7px 0px;
      border: 1px solid #dadce0;
      background-color: #f9f9f9;
      border-radius: 4px;
      width: 80px;
      cursor: pointer;
      &:last-child {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 7px 15px;
        width: 100px;
        span {
          &::first-letter {
            text-transform: capitalize;
          }
        }
        i {
          font-size: 10px;
        }
      }
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

.view_btn {
  width: 100px;
}

.logout_btn {
  width: 120px;
  button {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 120px;
    i {
      color: inherit;
      font-size: 22px;
    }
  }
}
</style>
