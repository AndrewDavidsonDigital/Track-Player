import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/views/Landing.vue'
import Player from '@/views/Player.vue'

export const routes = Object.freeze([
  {
    path: '/',
    name: 'home',
    component: Landing
  },
  {
    path: '/player',
    name: 'player',
    component: Player
  }]
)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router;
