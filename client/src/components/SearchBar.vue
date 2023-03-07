<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { toast } from "vue3-toastify";
import { searchEvents } from "@/services/Event";
import { debounce } from "@/utils";
import { EventDetail, PageMeta } from "@/types/Event";

let router = useRouter();

let route = useRoute();

let eventList = ref<EventDetail[]>([]);

let pageMeta = ref<PageMeta | null>(null);

let handleInput = debounce((event: Event) => {
  let { value } = event.target as HTMLInputElement;
  if (value.trim().length === 0) return;
  getEvents(value.trim());
}, 500);

let getEvents = async (search: string, page: number = 1) => {
  try {
    let {
      data: { data },
    } = await searchEvents({
      search,
      page,
      limit: 10,
    });
    eventList.value = data.list;
    pageMeta.value = data.pageMeta;
  } catch (err: any) {
    toast.error(err?.message || "Error");
  }
};

let handleClick = (date: string) => {
  router.push({
    query: {
      ...route.query,
      date,
    },
  });
};
</script>

<template>
  <div :class="styles.container">
    <input placeholder="Search by title" @input="handleInput" />
    <i className="bx-search"></i>
    <div :class="styles.events">
      <div
        v-for="{ _id, date, title, time } in eventList"
        :key="_id"
        :class="styles.card"
        @click="handleClick(dayjs(date).format('YYYY-MM-DD'))"
      >
        <img
          :src="`${$publicPath}images/dates/${dayjs(date).get('date')}.png`"
        />
        <div :class="styles.content">
          <span :class="styles.title">{{ title }}</span>
          <div :class="styles.date">
            <span>{{ dayjs(date).format("ddd MMM D, YYYY") }}</span>
            <span>{{ time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  //   &:has(input:not(:focus)) {
  //     .events {
  //       display: none;
  //     }
  //     input {
  //       border-radius: 8px;
  //     }
  //   }
  //   &:has(.events:empty) {
  //     input {
  //       border-radius: 8px;
  //     }
  //   }
  input {
    height: 45px;
    max-width: 768px;
    width: 100%;
    background: #f1f3f4;
    border: 1px solid transparent;
    border-radius: 8px 8px 0px 0px;
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
  .events {
    position: absolute;
    width: 100%;
    top: 100%;
    left: 0px;
    max-height: 249px;
    overflow-y: auto;
    z-index: 2;
    border-radius: 0px 0px 8px 8px;
    box-shadow: 0 1px 1px 0 rgba(65, 69, 73, 0.3),
      0 1px 3px 1px rgba(65, 69, 73, 0.15);
    &:not(:empty) {
      border-top: 1px solid #dadce0;
    }
    &::-webkit-scrollbar {
      width: 5px;
      border-top-right-radius: 10px;
    }
    &::-webkit-scrollbar-track {
      background: white;
    }
    &::-webkit-scrollbar-thumb {
      background: #bec1c6;
      border-radius: 10px;
    }
    .card {
      position: relative;
      display: flex;
      align-items: center;
      gap: 15px;
      color: #777;
      background-color: #fff;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 5px 10px;
      cursor: pointer;
      &::before {
        position: absolute;
        content: "";
        top: 0px;
        left: 0px;
        height: 100%;
        width: 2px;
        background-color: #4185f4;
        opacity: 0;
      }
      &:hover {
        background-color: #eeeeee;
        &::before {
          opacity: 1;
        }
      }
      img {
        width: 35px;
        height: 35px;
      }
      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-grow: 1;
        gap: 15px;
        span {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          word-break: break-all;
        }
        .title {
          font-size: 14px;
        }
        .date {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
          span {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
