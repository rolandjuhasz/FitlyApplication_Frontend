<script setup>
import Navbar from "./components/Navbar.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <Navbar />
  <div class="bg-[#131213] min-h-screen">
    <RouterView />
  </div>
</template>

<style scoped>
main {
  padding-top: 80px;
}

body {
  background-color: #131213;
}
</style>