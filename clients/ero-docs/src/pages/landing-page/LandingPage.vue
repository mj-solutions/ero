<template>
  <div class="flex flex-col h-screen items-center">
    <header class="flex items-end justify-between p-2 w-screen bg-white">
      <div class="flex gap-2">
        <img class="h-10 w-10" src="../../assets/android-chrome-512x512.png" />
        <h1 class="text-4xl text-black font-bold">ERO</h1>
      </div>
      <a class="ml-auto" href="https://github.com/mjnord/ero" target="_blank">
        <i class="pi pi-github text-3xl"></i>
      </a>
    </header>
    <main
      class="space-y-5 bg-white rounded-lg shadow-lg p-4 m-10 max-w-5xl text-center"
    >
      <p>
        Ero is an aggregator and notifier of graphics card stock information
        across multiple swedish retailers. It was created as a means of finding
        out about releases of graphics cards during the 2021 shortage. The Ero
        system consists of four interconnected parts: a backend which crawls a
        number of retailers for the current status of their graphics cards stock
        and pushes the latest data to a cloud database, an API which reads from
        that same database, a frontend which uses the API to give an overview of
        the current graphics cards availability, and finally a bot using both
        email and Telegram to report new findings as soon as they appear.
      </p>

      <p
        v-hover="onHover"
        :class="{
          'bg-[#6366f1]': showImages,
        }"
        class="rounded-xl p-1 bg-opacity-30 transition-colors"
      >
        The web frontend together with the reporting bot proved a reliable
        package solution to quickly find out about new graphics cards releases,
        and it did in fact help us and a number of our acquaintances to get our
        hands on graphics cards at a time when it for many seemed impossible to
        do so. (hover me 💖)
      </p>

      <p>
        We have decided to shut down our instance of ero however the source code
        is available on
        <a href="https://github.com/mjnord/ero" class="text-[#6366f1]">
          github.com
        </a>
        for anyone to use.
      </p>
    </main>
    <div class="flex flex-wrap max-w-6xl px-10 w-full justify-center gap-10">
      <img
        v-if="showImages"
        class="rounded-lg animate-fadeInLeft w-full sm:w-5/12"
        src="../../assets/ero-frontend-4.png"
      />
      <img
        v-if="showImages"
        class="rounded-lg -right-1/4 animate-fadeInRight w-full sm:w-5/12"
        src="../../assets/ero-frontend-2.png"
      />
    </div>
    <footer class="flex items-center justify-center h-16 mt-auto">
      <a href="https://mjnord.com" class="text-[#6366f1]">mjnord.com</a>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const showImages = ref(false);
function onHover(hovering: boolean) {
  if (hovering && !showImages.value) {
    showImages.value = hovering;
  }
}
</script>
