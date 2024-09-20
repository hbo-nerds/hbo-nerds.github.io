<template>
  <!-- main -->
  <main class="pt-3 pb-5">
    <h1 class="fw-bold mb-4">You</h1>
    <div class="row mb-5">
      <div class="col-12">
        <div class="d-flex align-items-center mb-3">
          <h2 class="fs-4 fw-bold mb-0">History</h2>
          <RouterLink :to="{ name: 'history' }" class="ms-auto">
            <button class="btn border rounded-pill" type="button">Toon alles</button>
          </RouterLink>
        </div>
        <div
          class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
        >
          <div v-for="item in historyContent.slice(0, itemsToShow)" class="col">
            <card-component :card="item" />
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-12">
        <div class="d-flex align-items-center mb-3">
          <h2 class="fs-4 fw-bold m-0">Playlists</h2>
          <RouterLink :to="{ name: 'playlists' }" class="ms-auto">
            <button class="btn border rounded-pill" type="button">Toon alles</button>
          </RouterLink>
        </div>
        <div
          class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
        >
          <div v-for="playlist in playlists.slice(0, itemsToShow)" class="col">
            <Playlist :playlist="playlist" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="d-flex align-items-center mb-3">
          <h2 class="fs-4 fw-bold m-0">Liked</h2>
          <RouterLink :to="{ name: 'liked-items' }" class="ms-auto">
            <button class="btn border rounded-pill" type="button">Toon alles</button>
          </RouterLink>
        </div>
        <div
          class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
        >
          <div v-for="item in likedContent.slice(0, itemsToShow)" class="col">
            <card-component :card="item" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import Playlist from "@/components/Playlist.vue";
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { defineAsyncComponent, onMounted, ref } from "vue";

const contentStore = useContentStore();
const generalStore = useGeneralStore();
const { likedContent, historyContent } = storeToRefs(contentStore);
const { playlists } = storeToRefs(generalStore);

const itemsToShow = ref(6);

const CardComponent = defineAsyncComponent(() => import("@/components/Card.vue"));

function setItems() {
  const w = window.innerWidth;
  if (w < 576) itemsToShow.value = 1;
  else if (w < 768) itemsToShow.value = 2;
  else if (w < 992) itemsToShow.value = 3;
  else if (w < 1200) itemsToShow.value = 4;
  else if (w < 1750) itemsToShow.value = 4;
  else if (w < 2075) itemsToShow.value = 5;
  else itemsToShow.value = 6;
}

onMounted(() => {
  setItems();
  window.addEventListener("resize", (event) => {
    setItems();
  });
});
</script>
