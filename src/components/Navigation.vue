<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { routes } from '@/router';
</script>

<template>
  <nav class="flex gap-x-4 justify-center">
    <template
      v-for="route, index in routes"
      :key="`nav_${index}`"
    >
      <RouterLink
        :to="route.path"
        class="hover:underline capitalize"
      >
        {{ route.name }}
      </RouterLink>
    </template>
  </nav>
</template>
