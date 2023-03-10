<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { toast } from "vue3-toastify";
import { searchEvents } from "@/services/Event";
import { debounce, timeSlots } from "@/utils";
import { EventDetail, PageMeta } from "@/types/Event";

let router = useRouter();

let route = useRoute();

let isLoading = ref(true);

let loadData = ref(false);

let eventList = ref<EventDetail[] | null>(null);

let pageMeta = ref<PageMeta | null>(null);

let isOpen = ref(false);

let search = ref("");

let searchContainer = ref<HTMLElement | null>(null);

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

watch(
  search,
  debounce(() => {
    if (!isLoading.value) isLoading.value = true;
    eventList.value = [];
    getEvents();
  }, 500)
);

let getEvents = async (page: number = 1) => {
  try {
    let {
      data: { data },
    } = await searchEvents({
      search: search.value,
      page,
      limit: 10,
    });

    if (!eventList.value) {
      eventList.value = data.list;
    } else {
      eventList.value = [...eventList.value, ...data.list];
    }
    pageMeta.value = data.pageMeta;
  } catch (err: any) {
    toast.error(err?.message || "Error");
  } finally {
    if (isLoading.value) isLoading.value = false;
    if (loadData.value) loadData.value = false;
  }
};

let handleClick = (date: string) => {
  closePopup();
  router.push({
    query: {
      view: "day",
      date,
    },
  });
};

let handleScroll = (event: UIEvent) => {
  let { scrollHeight, scrollTop, clientHeight } = event.target as HTMLElement;

  if (
    scrollHeight - scrollTop !== clientHeight ||
    loadData.value ||
    !pageMeta.value ||
    pageMeta.value.page >= pageMeta.value.totalPages
  )
    return;

  loadData.value = true;
  getEvents(pageMeta.value.page + 1);
};
</script>

<template>
  <div ref="searchContainer" :class="styles.search_bar">
    <input
      placeholder="Search by title"
      v-model="search"
      @focus="handleFocus"
    />
    <i className="bx-search"></i>
    <div
      v-if="isOpen && eventList"
      :class="styles.events"
      @scroll="handleScroll"
    >
      <div v-if="isLoading" :class="styles.msg">
        <span>Loading...</span>
      </div>
      <div v-else-if="eventList.length === 0" :class="styles.msg">
        <span>No events found</span>
      </div>
      <div
        v-else
        v-for="{ _id, date, title, time } in eventList"
        :key="_id"
        :class="styles.card"
        @click="handleClick(date)"
      >
        <img
          :src="`${$publicPath}images/dates/${dayjs(date).get('date')}.png`"
          alt=""
        />
        <div :class="styles.content">
          <span :class="styles.title">{{ title }}</span>
          <div :class="styles.date">
            <span>{{ dayjs(date).format("ddd MMM D, YYYY") }}</span>
            <span>{{ timeSlots[time].time }}</span>
          </div>
        </div>
      </div>
      <div v-if="loadData" :class="styles.loader">
        <span>Loading..</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
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
  .events {
    position: absolute;
    width: 100%;
    top: 100%;
    left: 0px;
    max-height: 256px;
    overflow-y: auto;
    z-index: 2;
    border-radius: 0px 0px 8px 8px;
    background-color: #fff;
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
    .msg {
      display: flex;
      justify-content: center;
      padding: 30px;
      font-size: 14px;
    }
    .loader {
      display: flex;
      justify-content: center;
      padding: 10px;
      font-size: 14px;
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
            &:last-child {
              text-transform: lowercase;
            }
          }
        }
      }
    }
  }
}
</style>
