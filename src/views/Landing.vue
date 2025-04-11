<script setup lang="ts">

</script>

<template>
  <section class="flex flex-col items-center mx-[10vw]">
    <h2 class="text-lg font-semibold">
      Project: Disc-Jockey
    </h2>
    <p>This project was a small challenge to see how much of a digital jukebox could be constructed within a quick coding session (think it was 2 rounds of 2.5hrs each)</p>
    <h2 class="text-lg font-semibold">
      Features:
    </h2>
    <ul>
      <li><p>Track Selection</p></li>
      <li><p>Track rotation via mouse wheel</p></li>
      <li><p>Disk visual representation</p></li>
      <li><p>Track progress visuals</p></li>
      <li><p>Limited player controls</p></li>
    </ul>
    <h2 class="text-lg font-semibold">
      Missing Features:
    </h2>
    <ul>
      <li><p>Volume Slider, (Added in ~5mins post dev)</p></li>
      <li><p>Track selection rocker needs a cleanup on smaller devices</p></li>
      <li><p>Background media | or maybe entire player, needs to constrained so it doesn't stretch out at more standard breakpoints</p></li>
      <li><p>Tracks at angles more than say 80'deg +- of right center should be set to translucent and only solidify once within that 160'deg band</p></li>
    </ul>
  </section>
</template>
