<script setup lang="ts">
  import { LoopIcon, RandomTrackIcon } from '@/components/icons';
  import type { ProgressType } from '@/views/Player.vue';


  interface Props {
    playPause: () => void;
    stop: () => void;
    startRandom: () => void;
    toggleProgType: (_t: ProgressType) => void;
    setVolume: (_n: number) => void;

    progressType: ProgressType;
    progressionPercent: number;
  }
  const props = defineProps<Props>()

</script>

<template>
  <section 
    class="
      w-full h-fit 
      mt-[clamp(-8dvw,-5dvh,-2dvw)] md:mt-5 z-100 
      [&>div>button]:cursor-pointer 
      flex flex-col gap-4 
      self-center md:self-start 
      p-5
      bg-slate-800/50 rounded-md md:bg-transparent
      md:-order-1
    "
  >
    <div class="flex flex-wrap gap-4 justify-center">
      <button 
        class="border rounded-md py-1 px-2 bg-slate-800"
        @click="e => props.playPause()"
      >
        Play / Pause
      </button>
      <button 
        class="border rounded-md py-1 px-2 bg-slate-800"
        @click="e => props.stop()"
      >
        Stop
      </button>
      <button 
        class="border rounded-md py-1 px-2 bg-slate-800"
        @click="e => props.startRandom()"
      >
        Random Track
      </button>
      <button 
        class="border rounded-md py-1 px-2 bg-slate-800"
        :class="{ 'border-amber-500 text-amber-500' : progressType === 'Random'}"
        aria-label="Set progress mode to 'Random'"
        @click="() => props.toggleProgType('Random')"
      >
        <RandomTrackIcon role="presentation" />
      </button>
      <button 
        class="border rounded-md py-1 px-2 bg-slate-800"
        :class="{ 'border-amber-500 text-amber-500' : progressType === 'Loop'}"
        aria-label="Set progress mode to 'loop'"
        @click="() => props.toggleProgType('Loop')"
      >
        <LoopIcon role="presentation" />
      </button>
      <input
        class="w-20"
        type="range"
        min="0"
        max="1"
        step="0.05"
        aria-label="Volume range"
        value="0.1"
        @input="(e) => props.setVolume(Number((e.target as HTMLInputElement).value))"
      />
    </div>
    <div class="md:w-full md:px-10">
      <input
        disabled
        class="w-full seek-bar"
        :value="progressionPercent"
        type="range"
        min="0"
        max="100"
        step="0.05"
        aria-label="Track Progression"
        aria-hidden="true"
        role="presentation"
      />
    </div>
  </section>
</template>


<style lang="css" scoped>

  input[type=range].seek-bar  {
    &:focus-visible, &:hover, &:disabled {
      @apply outline-none;
      -webkit-appearance: none; /* Hides the slider so that custom slider can be made */

      &::-webkit-slider-thumb{
        @apply appearance-none;
        @apply shadow-none border-none;

        height: 1rem;
        width: 1rem;
        border-radius: 100%;
        background-color: var(--color-emerald-400) !important;
        @apply border;
        border: 1px solid var(--color-emerald-600);
        
        @apply translate-y-[-33%];
      }
      &::-moz-range-thumb{
        @apply appearance-none;
        @apply shadow-none border-none;

        height: 1rem;
        width: 1rem;
        border-radius: 100%;
        background-color: var(--color-emerald-400) !important;
        @apply border;
        border: 1px solid var(--color-emerald-600);
      }

      &::-webkit-slider-runnable-track{
        background-color: var(--color-emerald-400) !important;
        @apply h-1/3 rounded-full translate-y-[33%];
      }
      &::-moz-range-track{
        background-color: var(--color-emerald-400) !important;
        @apply h-1/3 rounded-full translate-y-[33%];
      }
    }
  }
</style>