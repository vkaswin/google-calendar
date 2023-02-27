<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import useAuth from "@/store/useAuth";

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
  <router-view />
</template>
