<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue';
import FooterElement from './components/FooterElement.vue';
</script>

<template>
  <main 
    class="
      bg-slate-800 text-green-500 
      min-h-screen min-w-full 
      flex flex-col 
      justify-start lg:justify-between lg:border-x-2 border-slate-900
    "
  >
    <header class="h-fit  bg-slate-900">
      <Navigation />
    </header>
    <RouterView />
    <FooterElement />
  </main>
</template>
