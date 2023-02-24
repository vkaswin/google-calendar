<script setup lang="ts">
import { CalendarView } from "@/types/calendar";
import { getDayName } from "@/utils";
import { toRefs, computed } from "vue";

type WeekCalendarProps = {
  selectedDate: Date;
  view: CalendarView;
};

let props = defineProps<WeekCalendarProps>();

let { view, selectedDate } = toRefs(props);

let todayDate = new Date();

let columns = computed(() => (view.value === "week" ? 7 : 1));

let times = [
  {
    time: "12 PM - 1 AM",
    label: "12 PM",
  },
  {
    time: "1 AM - 2 AM",
    label: "1 AM",
  },
  {
    time: "2 AM - 3 AM",
    label: "2 AM",
  },
  {
    time: "3 AM - 4 AM",
    label: "3 AM",
  },
  {
    time: "4 AM - 5 AM",
    label: "4 AM",
  },
  {
    time: "5 AM - 6 AM",
    label: "5 AM",
  },
  {
    time: "6 AM - 7 AM",
    label: "6 AM",
  },
  {
    time: "7 AM - 8 AM",
    label: "7 AM",
  },
  {
    time: "8 AM - 9 AM",
    label: "8 AM",
  },
  {
    time: "9 AM - 10 AM",
    label: "9 AM",
  },
  {
    time: "10 AM - 11 AM",
    label: "10 AM",
  },
  {
    time: "11 AM - 12 AM",
    label: "11 AM",
  },
  {
    time: "12 AM - 1 PM",
    label: "12 AM",
  },
  {
    time: "1 PM - 2 PM",
    label: "1 PM",
  },
  {
    time: "2 PM - 3 PM",
    label: "2 PM",
  },
  {
    time: "3 PM - 4 PM",
    label: "3 PM",
  },
  {
    time: "4 PM - 5 PM",
    label: "4 PM",
  },
  {
    time: "5 PM - 6 PM",
    label: "5 PM",
  },
  {
    time: "6 PM - 7 PM",
    label: "6 PM",
  },
  {
    time: "7 PM - 9 PM",
    label: "7 PM",
  },
  {
    time: "8 PM - 9 PM",
    label: "8 PM",
  },
  {
    time: "9 PM - 10 PM",
    label: "9 PM",
  },
  {
    time: "10 PM - 11 PM",
    label: "10 PM",
  },
  {
    time: "11 PM - 12 PM",
    label: "11 PM",
  },
];

let dates = computed(() => {
  let dates: Date[] = [];
  let date = structuredClone(selectedDate.value);

  dates.push(structuredClone(date));

  if (view.value === "week") {
    for (let i = date.getDay(); i < 6; i++) {
      date.setDate(date.getDate() + 1);
      dates.push(structuredClone(date));
    }

    date = structuredClone(selectedDate.value);

    for (let i = selectedDate.value.getDay(); i > 0; i--) {
      date.setDate(date.getDate() - 1);
      dates.unshift(structuredClone(date));
    }
  }

  return dates;
});

let handleEvent = (date?: Date, time?: string) => {
  if (date && time) {
    console.log(
      "🚀 ~ file: WeekCalendar.vue:72 ~ handleTime ~ date, time",
      date,
      time
    );
  } else {
    console.log("close popup");
  }
};
</script>

<template>
  <div :class="styles.container" :data-view="view">
    <div :class="styles.week_section">
      <div></div>
      <div
        v-for="(date, index) in dates"
        :key="index"
        :class="[
          styles.week,
          todayDate.toLocaleDateString() === date.toLocaleDateString() &&
            styles.highlight,
        ]"
      >
        <span>{{ getDayName(date.getDay()) }}</span>
        <span>{{ date.getDate() }}</span>
      </div>
    </div>
    <div :class="styles.divider"></div>
    <div :class="styles.time_section">
      <div
        :class="styles.time_container"
        v-for="({ label, time }, index) in times"
        :key="index"
      >
        <div :class="styles.time">
          <span v-if="index !== 0">{{ label }}</span>
        </div>
        <div
          :class="styles.date"
          v-for="index in columns"
          :key="index"
          @click="handleEvent(dates[index - 1], time)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  height: 100%;
  padding-top: 15px;
  --week-wrapper-height: 95px;
  --divider-height: 1px;
  --light-gray: rgb(218, 220, 224);
  .week_section {
    display: grid;
    grid-template-columns: 40px repeat(7, 1fr);
    height: var(--week-wrapper-height);
    padding-right: 15px;
    .week {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      &:nth-child(2)::before {
        left: 0px;
      }
      &::before {
        content: "";
        position: absolute;
        left: -1px;
        bottom: 0px;
        height: 25px;
        width: 1px;
        background-color: var(--light-gray);
      }
      &:is(.highlight) {
        span {
          &:first-child {
            color: rgb(26, 115, 232);
          }
          &:last-child {
            color: #fff;
            background-color: rgb(26, 115, 232);
          }
        }
      }
      &:not(.highlight) {
        span {
          &:last-child {
            &:hover {
              background-color: #f1f3f4;
            }
          }
        }
      }
      span {
        &:first-child {
          color: #70757a;
          font-size: 14px;
        }
        &:last-child {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          color: #70757a;
          font-size: 24px;
          font-family: "Poppins-Medium", sans-serif;
          transition: background-color 0.25s ease-in-out;
          cursor: pointer;
        }
      }
    }
  }
  .divider {
    position: relative;
    left: 30px;
    background-color: var(--light-gray);
    height: var(--divider-height);
    width: calc(100% - 45px);
  }
  .time_section {
    position: relative;
    height: calc(100% - var(--week-wrapper-height) - var(--divider-height));
    overflow-y: auto;
    .time_container {
      display: grid;
      grid-template-columns: 40px repeat(v-bind(columns), 1fr);
      grid-auto-rows: 50px;
      &:not(:first-child) {
        .time {
          &::before {
            content: "";
            position: absolute;
            top: 4px;
            right: 0px;
            width: 10px;
            height: 1px;
            background-color: var(--light-gray);
          }
        }
      }
      .time {
        position: relative;
        color: #70757a;
        font-size: 10px;
        font-family: "Poppins-Medium", sans-serif;
        margin-top: -5px;
      }
      .date {
        border-color: var(--light-gray);
        border-style: solid;
        border-width: 0px 1px 1px 0px;
        cursor: pointer;
        &:nth-child(2) {
          border-width: 0px 1px 1px 1px;
        }
      }
    }
  }
}

.container[data-view="week"] {
  .time_section {
    .time_container {
      .date {
        &:last-child {
          border-width: 0px 0px 1px 0px;
        }
      }
    }
  }
}
</style>
