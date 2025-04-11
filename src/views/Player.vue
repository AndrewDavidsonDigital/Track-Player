<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import trackList from '@/assets/trackList.json';


const deg = ref(5);

interface IAlbum {
  title: string;
  trackNumber: number;
}

interface ITackInfo {
  title: string;
  album?: IAlbum;
  band: string;
  path: string;
}

const options = ref<ITackInfo[]>(trackList.tracks);

const displayables = computed(() => {
  let retval: ITackInfo[] = [...(options.value)];
  while (retval.length < (360 / deg.value)) {
    retval = retval.concat([...(options.value)]);
  }
  return retval;
});

const activeTrack = ref(displayables.value.length / 2);
const playingTrack = ref(displayables.value.length / 2);

watch(displayables, (newVal) => {
  activeTrack.value = newVal.length / 2;
});


function changeTrack(event: WheelEvent){
  if (event.deltaY > 0){
    console.log('scrolling: down');
    setDisplayedTrack(activeTrack.value - 1);
  }else {
    console.log('scrolling: up');
    setDisplayedTrack(activeTrack.value + 1);
  }
}

function setPlayingTrack(newIndex: number){
  playingTrack.value = newIndex;
  setDisplayedTrack(newIndex);
}

function setDisplayedTrack(newIndex: number){
  activeTrack.value = newIndex;
}
</script>

<template>
  <div>
    <div>playingTrack: {{ displayables[playingTrack] }}</div>
    <section class="flex items-center h-full overflow-x-clip">
      <div 
        class="bg-red-400 w-full aspect-square grid-area-stack text-right  items-center pr-5 overflow-clip"
        @wheel.passive="(e) => changeTrack(e)"
      >
        <template
          v-for="trackDetail ,index in displayables"
          :key="`track_${index}`"
        >
          <button 
            :id="`track_${index}`"
            :style="`rotate:${deg * (activeTrack - index)}deg`"
            class="text-xl hover:text-pink-500 h-dynamic origin-[left_center] content-center transition-all duration-150"
            :class="[
              { 'text-amber-400' : playingTrack === index },
            ]"
            @click="() => setPlayingTrack(index)"
            @keypress="() => setPlayingTrack(index)"
          >
            <h3 class="text-right">
              {{ trackDetail.title }}
            </h3>
          </button>
        </template>
      </div>
      <div class="from-emerald-400 to-teal-900 bg-gradient-to-b w-full aspect-square rounded-full animate-spin translate-x-72 scale-125" />
    </section>
  </div>
</template>

<style lang="css" scoped>
  .h-dynamic{
    height: calc-size(fit-content, size + 2rem);
  }
</style>