<script setup lang="ts">
import { ref, watch, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { toast } from "vue3-toastify";
import { searchEvents } from "@/services/Event";
import { debounce, timeSlots } from "@/utils";
import { EventDetail, PageMeta } from "@/types/Event";

type SearchBarProps = {
  search: string;
};

type SearchBarEmits = {
  (event: "onClose"): void;
};

let props = defineProps<SearchBarProps>();

let emit = defineEmits<SearchBarEmits>();

let { search } = toRefs(props);

let router = useRouter();

let route = useRoute();

let isLoading = ref(true);

let loadData = ref(false);

let eventList = ref<EventDetail[] | null>(null);

let pageMeta = ref<PageMeta | null>(null);

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
  emit("onClose");
  router.push({
    query: {
      ...route.query,
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
  <div v-if="eventList" :class="styles.events" @scroll="handleScroll">
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
</template>

<style lang="scss" module="styles">
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
</style>
