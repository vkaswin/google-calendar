<script setup lang="ts">
import { toRefs, computed, ref, watch } from "vue";
import dayjs from "dayjs";
import SearchBar from "@/components/SearchBar.vue";
import Popper from "@/components/Popper.vue";
import { User } from "@/types/User";
import { CalendarView } from "@/types/Event";

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
  (event: "onLogout"): void;
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

let isOpen = ref(false);

let search = ref("");

let searchContainer = ref<HTMLElement | null>(null);

let userInitial = computed(() => {
  if (!user.value) return;
  let [firstName, lastName] = user.value.name.split(" ");
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.trim();
});

let handlePointerDown = (event: PointerEvent) => {
  if (searchContainer.value?.contains(event.target as HTMLElement)) return;
  document.removeEventListener("pointerdown", handlePointerDown);
  closePopup();
};

let handleFocus = () => {
  openPopup();
  document.addEventListener("pointerdown", handlePointerDown);
};

let openPopup = () => {
  isOpen.value = true;
};

let closePopup = () => {
  isOpen.value = false;
};
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.logo">
      <img
        :src="`${$publicPath}images/dates/${new Date().getDate()}.png`"
        alt=""
      />
      <span>Calender</span>
    </div>
    <div :class="styles.date_section">
      <button :class="styles.reset" @click="emit('onReset')">Today</button>
      <div :class="styles.date">
        <div :class="styles.icon">
          <i class="bx-chevron-left" @click="emit('onPrevious')"></i>
          <i class="bx-chevron-right" @click="emit('onNext')"></i>
        </div>
        <span>{{ dayjs(date).format("MMMM YYYY") }}</span>
      </div>
      <button id="view-dropdown" :class="styles.dropdown">
        <span>{{ view }}</span>
        <i class="bxs-down-arrow"></i>
      </button>
      <Popper
        :target="`.${styles.dropdown}`"
        :class-name="styles.view_btn"
        placement="bottom-start"
        v-slot="{ toggle }"
      >
        <button
          v-for="({ label, value }, index) in options"
          :key="index"
          :class="styles.item"
          @click="
            () => {
              toggle();
              emit('onViewChange', value);
            }
          "
        >
          {{ label }}
        </button>
      </Popper>
    </div>
    <div ref="searchContainer" :class="styles.search_bar">
      <input
        placeholder="Search by title"
        v-model="search"
        @focus="handleFocus"
      />
      <i className="bx-search"></i>
      <SearchBar v-if="isOpen" :search="search" @on-close="closePopup" />
    </div>
    <div :class="styles.avatar">
      <div id="avatar">
        <span>{{ userInitial }}</span>
      </div>
    </div>
  </div>
  <Popper
    target="#avatar"
    :class-name="styles.logout_btn"
    placement="bottom-end"
    v-slot="{ toggle }"
  >
    <button
      @click="
        () => {
          toggle();
          emit('onLogout');
        }
      "
    >
      <i class="bx-log-out-circle"></i>
      <span>Logout</span>
    </button>
  </Popper>
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
  .search_bar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      height: 45px;
      max-width: 768px;
      width: 100%;
      background: #f1f3f4;
      border: 1px solid transparent;
      border-radius: 8px;
      padding: 0px 40px 0px 15px;
      outline: none;
      &:focus {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 1px 1px 0 rgba(65, 69, 73, 0.3),
          0 1px 3px 1px rgba(65, 69, 73, 0.15);
      }
    }
    i {
      position: absolute;
      right: 5px;
      font-size: 22px;
      width: 35px;
      height: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #606368;
      font-size: 22px;
      border-radius: 50%;
      transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      &:hover {
        background-color: #dadce0;
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
