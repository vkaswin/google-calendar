<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import useAuth from "@/store/useAuth";
import Calendar from "./views/Calendar.vue";

let auth = useAuth();

let { logout } = auth;

onMounted(() => {
  document.addEventListener("unauthorized", logout);
});

onUnmounted(() => {
  document.removeEventListener("unauthorized", logout);
});
</script>

<template>
  <!-- <router-view /> -->
  <calendar />
</template>
