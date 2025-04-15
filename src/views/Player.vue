<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
  import trackList from '@/assets/trackList.json';
  import { RefreshIcon, LoopIcon, RandomTrackIcon } from '@/components/icons';

  const AUDIO_ENGINE_ID = '_audio_engine';
  const TOUCH_TICK_LENGTH = 100; // 100ms debouncer

  type ProgressType = "Next" | "Loop" | "Random"

  const deg = ref(5);
  const audioEngine = ref<HTMLAudioElement>();
  const progressionPercent = ref(0);
  const currentlyPlayingMusic = ref(false);
  const progressType = ref<ProgressType>("Next");
  const volumeValue = ref(0.1);

  const touchTick = ref<number>(0);
  const touchPrev = ref<Touch>();

  const isLocal = import.meta.env.DEV

  interface IAlbum {
    title: string;
    trackNumber: number;
    albumArt: string;
  }

  interface ITackInfo {
    title: string;
    album?: IAlbum;
    band: string;
    path: string;
  }

  const options = ref<ITackInfo[]>(trackList.tracks);

  /* 
   * remove this if you are testing this locally (yarn boot / yarn dev) without 
   * the full tracks (these are not included for obvious copyright reasons) 
   */
  if (isLocal){
    options.value.map(el => el.path = el.path.replace('/tracks/', '/tracks-full/'))
  }

  const displayables = computed(() => {
    let retval: ITackInfo[] = [...(options.value)];
    while (retval.length < (360 / deg.value)) {
      retval = retval.concat([...(options.value)]);
    }
    return retval.slice(0, (360 / deg.value));
  });

  const currentTrack = computed(() => {
    return displayables.value[playingTrack.value];
  });

  const activeTrack = ref(displayables.value.length / 2);
  const playingTrack = ref(displayables.value.length / 2);

  watch(displayables, (newVal) => {
    activeTrack.value = newVal.length / 2;
  });
  
  watch(progressionPercent, (newVal) => {
    if (newVal >= 99){
      console.log('end of file');
      progressTrack();
    }
  });

  
  function progressTrack(){
    switch (progressType.value) {
      case 'Next':
        startNext();
        break;
      case 'Loop':
        break;
      case 'Random':
        startRandom();
        break;
    
      default:
        break;
    }
  }
  function handleMovePress(e: TouchEvent) {
    console.log('pressed');
    // console.log(e);
    touchPrev.value = e.changedTouches[0];
  }

  function handleMoveRelease(e: TouchEvent) {
    const time = e.timeStamp;
    console.log('released');
    // console.log(e);
    touchTick.value = time;
  }
  function handleMove(e: TouchEvent) {
    const time = e.timeStamp;
    if (time > (touchTick.value + TOUCH_TICK_LENGTH)){
      // console.log(e);
      touchTick.value = time;
      let deltaX = 0;
      if (touchPrev.value?.clientX){
        deltaX = touchPrev.value?.clientX - e.changedTouches[0].clientX;
      }
      // console.log(`Deltas: [x]: ${deltaX} [y]: ${deltaY}`);
      touchPrev.value = e.changedTouches[0];

      if (Math.abs(deltaX) > 2){
        setDisplayedTrack(activeTrack.value + (deltaX / 3));
      }
    } else {
      console.log("bounced");
    }
  }


  function changeTrack(event: WheelEvent){
    if (event.deltaY > 0){
      // console.log('scrolling: down');
      setDisplayedTrack(activeTrack.value - 1);
    }else {
      // console.log('scrolling: up');
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

  function playbackStarted(){
    console.log(Date.now(),': Playback Started "' + currentTrack.value.band + ' - ' + currentTrack.value.title + '"');
    // progressionPercent.value = 0;
  }

  const TIMER_INTERVAL = 200;
  let intervalId = -1;

  function ticker(){
    const d = audioEngine.value?.duration || 1;
    const c = audioEngine.value?.currentTime || 0;
    const position = ((c/d)*100).toFixed(2);
    // console.log("Current position: ", `${position}%`);
    progressionPercent.value = Number(position);

    currentlyPlayingMusic.value = !(audioEngine.value?.paused)
  }

  function playPause(){
    console.log('playPause')
    if (!(audioEngine.value)) {
      return
    }

    if (audioEngine.value.paused){
      audioEngine.value?.play();
    }else{
      audioEngine.value?.pause();
    }
    
  }

  function startNext(){
    console.log('startNext')
    if (!(audioEngine.value)) {
      return
    }

    audioEngine.value.pause();

    const newTrackIndex = ( (playingTrack.value + 1) % displayables.value.length);
    // console.log('new index is: ', newTrackIndex)

    setPlayingTrack(newTrackIndex);

  }

  function startRandom(){
    console.log('startRandom')
    if (!(audioEngine.value)) {
      return
    }

    audioEngine.value.pause();

    const newTrackIndex = (Math.round(Math.random() * displayables.value.length) % (displayables.value.length -1));
    // console.log('new index is: ', newTrackIndex)

    setPlayingTrack(newTrackIndex);

  }

  function stop(){
    console.log('stop')
    if (!(audioEngine.value)) {
      return
    }

    audioEngine.value.pause();
    audioEngine.value.currentTime = 0;

  }

  function toggleProgType(progType: ProgressType){
    if (progressType.value === progType){
      progressType.value = 'Next';
    }else{
      progressType.value = progType;
    }
  }

  function keyboardNavigate(e: KeyboardEvent, targetIndex:number){
    setPlayingTrack(targetIndex); 
    const focusTarget: HTMLElement| null = ((e.srcElement as HTMLButtonElement).parentElement?.parentElement)?.querySelector(`#track_${targetIndex}`) || null;
    focusTarget?.focus();
  }

  onMounted(()=> {
    const el = document.getElementById(AUDIO_ENGINE_ID) as HTMLAudioElement;
    if (el){
      audioEngine.value = el;

      intervalId = (setInterval(() => ticker(), TIMER_INTERVAL) as unknown as number);
    }
  });

  onUnmounted(()=>{
    if (intervalId !== -1){
      clearInterval(intervalId);
    }
  })

</script>

<template>
  <div class="grid-area-stack ">
    <audio
      :id="AUDIO_ENGINE_ID"
      class="pointer-events-none"
      :src="displayables[playingTrack].path"
      :volume="volumeValue"
      playsinline
      autoplay
      loop
      @play="() => playbackStarted()"
    ></audio>
    <section 
      class="
        w-full h-fit 
        mt-[clamp(-8dvw,-5dvh,-2dvw)] md:mt-5 z-100 
        [&>div>button]:cursor-pointer 
        flex flex-col gap-4 
        self-center md:self-start 
        p-5
        bg-slate-800/50 rounded-md md:bg-transparent
      "
    >
      <div class="flex flex-wrap gap-4 justify-center">
        <button 
          class="border rounded-md py-1 px-2 bg-slate-800"
          @click="e => playPause()"
        >
          Play / Pause
        </button>
        <button 
          class="border rounded-md py-1 px-2 bg-slate-800"
          @click="e => stop()"
        >
          Stop
        </button>
        <button 
          class="border rounded-md py-1 px-2 bg-slate-800"
          @click="e => startRandom()"
        >
          Random Track
        </button>
        <button 
          class="border rounded-md py-1 px-2 bg-slate-800"
          :class="{ 'border-amber-500 text-amber-500' : progressType === 'Random'}"
          aria-label="Set progress mode to 'Random'"
          @click="() => toggleProgType('Random')"
        >
          <RandomTrackIcon />
        </button>
        <button 
          class="border rounded-md py-1 px-2 bg-slate-800"
          :class="{ 'border-amber-500 text-amber-500' : progressType === 'Loop'}"
          aria-label="Set progress mode to 'loop'"
          @click="() => toggleProgType('Loop')"
        >
          <LoopIcon />
        </button>
        <input
          class="w-20"
          type="range"
          min="0"
          max="1"
          step="0.05"
          aria-label="Volume range"
          role="presentation"
          value="0.1"
          @input="(e) => volumeValue = Number((e.target as HTMLInputElement).value)"
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
          role="presentation"
        />
      </div>
    </section>
    <div>
      <img
        class="aspect-square max-h-[90dvh] w-full max-w-content opacity-40 object-cover"
        :src="displayables[playingTrack].album?.albumArt"
        alt=""
      >
    </div>
    <section class="grid md:grid-cols-2 items-center h-full overflow-clip max-h-[90dvh]">
      <div 
        class="
          mx-auto md:mx-[unset] rotate-90 md:rotate-360 
          w-[100vw] md:w-[unset]
          max-w-[50dvh] md:max-h-2/3 md:min-w-1/2
          aspect-square 
          bg-slate-600 grid-area-stack text-right items-center 
          overflow-clip clip-edge
          translate-y-[-120px] md:translate-y-0
        "
        @touchmove="(e) => handleMove(e)"
        @touchend="(e) => handleMoveRelease(e)"
        @touchstart="(e) => handleMovePress(e)"
        @wheel.passive="(e) => changeTrack(e)"
      >
        <template
          v-for="trackDetail ,index in displayables"
          :key="`track_${index}`"
        >
          <button 
            :id="`track_${index}`"
            :style="`rotate:${deg * (activeTrack - index)}deg`"
            class="pr-5 text-xl text-slate-800  h-dynamic origin-[left_center] content-center transition-all duration-300"
            :data-index="index"
            :data-active="activeTrack"
            :data-deg="deg * (activeTrack - index)"
            :data-degClean="Math.abs((deg * (activeTrack - index)) % 360)"
            :tabindex="((
              activeTrack > 0 ? 
                (activeTrack % displayables.length) : 
                (Math.abs(displayables.length - Math.abs(activeTrack))) % displayables.length)
              === index) ? 0 : -1"
            :class="[
              { '!text-amber-400 underline underline-offset-3' : playingTrack === index },
              { '-translate-x-5 md:border-r border-amber-500 rounded-2xl !text-green-600' : (
                activeTrack > 0 ? 
                  (activeTrack % displayables.length) : 
                  (Math.abs(displayables.length - Math.abs(activeTrack))) % displayables.length)
                === index
              },
              { 'opacity-0 pointer-events-none' : (Math.abs((deg * (activeTrack - index)) % 360) > 45) && (Math.abs((deg * (activeTrack - index)) % 360) < 315)}
            ]"
            @click="() => setPlayingTrack(index)"
            @keypress.space.enter="() => setPlayingTrack(index)"
            @keydown.arrow-up="((e:KeyboardEvent) => keyboardNavigate(e, index - 1))"
            @keydown.arrow-down="((e:KeyboardEvent) => keyboardNavigate(e, index + 1))"
          >
            <h3 class="text-right cursor-pointer">
              <span class="hidden lg:inline">{{ trackDetail.band }}:</span> {{ trackDetail.title }}
            </h3>
          </button>
        </template>
        <button 
          class="hidden md:flex bg-slate-900 size-10 rounded-full border-2 border-slate-600 z-10 md:ml-20 cursor-pointer group  justify-center"
          title="Reset Orientation"
          aria-label="Reset Orientation"
          @click="() => activeTrack = playingTrack"
        >
          <RefreshIcon class="size-full p-1.5 z-10 text-emerald-600 opacity-10 group-hover:opacity-100" />
        </button>
      </div>
      <div 
        class="z-10 p-[10dvw] md:p-0 md:!bg-none bg-no-repeat bg-contain"
        :style="`background-image: url('${displayables[playingTrack].album?.albumArt}');`"
      >
        <div 
          class="
            mx-auto md:mx-[unset] 
            grid-area-stack rounded-full items-center
            animate-spin animation-duration-3000 
            md:translate-x-[clamp(10px,15vw,40%)] scale-[110%] overflow-clip border-2 
            border-slate-600 animation-duration-1000
            max-h-2/3 aspect-square
          "
          :class="[
            { 'animation-play' : currentlyPlayingMusic },
            { 'animation-pause' : !currentlyPlayingMusic }
          ]"
        >
          <img
            class="min-h-full min-w-full"
            :src="displayables[playingTrack].album?.albumArt"
            alt=""
          >
          <div class="to-slate-400/50 from-slate-900/50 bg-radial size-full" />
          <div class="bg-slate-900 size-10 rounded-full border-2 border-slate-600 justify-self-center" />
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="css" scoped>

  .h-dynamic{
    height: calc-size(fit-content, size + 2rem);
  }
  .clip-edge {
    clip-path: circle(100% at 0px 50%);
  }

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