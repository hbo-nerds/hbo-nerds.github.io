<template>
  <!-- main -->
  <main class="pt-3 pb-5">
    <Profile class="mb-4" />
    <div class="row mb-5">
      <div class="col-12">
        <div class="d-flex gap-3 justify-content-between align-items-center mb-3">
          <h2 class="fs-5 fw-bold mb-0">Geschiedenis</h2>
          <RouterLink
            v-if="historyContent.length"
            :to="{ name: 'history' }"
            class="btn btn-dark border-0 rounded-pill"
            tag="button"
          >
            <i class="bi bi-clock-history me-2"></i>Toon alle
          </RouterLink>
        </div>
        <div
          class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
        >
          <div v-for="item in historyContent.slice(0, itemsToShow)" class="col">
            <card-component :card="item" />
          </div>
          <div v-if="!historyContent.length" class="col">
            <div>Geen geschiedenis gevonden.</div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-12">
        <div class="d-flex gap-3 justify-content-between align-items-center mb-3">
          <h2 class="fs-5 fw-bold m-0">Afspeellijsten</h2>
          <RouterLink
            v-if="playlists.length"
            :to="{ name: 'playlists' }"
            class="btn btn-dark border-0 rounded-pill"
            tag="button"
          >
            <i class="bi bi-collection-play me-2"></i>Toon alle
          </RouterLink>
        </div>
        <div
          class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
        >
          <div
            v-for="(playlist, index) in playlists.slice(0, itemsToShow)"
            class="col"
            :key="playlist.title"
          >
            <Playlist :playlist="playlist" />
          </div>
          <div v-if="!playlists.length" class="col">
            <div>Geen afspeellijsten gevonden.</div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-12">
        <div class="d-flex gap-3 justify-content-between align-items-center mb-3">
          <h2 class="fs-5 fw-bold m-0">Gelikete items</h2>
          <RouterLink
            v-if="likedContent.length"
            :to="{ name: 'liked-items' }"
            class="btn btn-dark border-0 rounded-pill"
            tag="button"
          >
            <i class="bi bi-hand-thumbs-up me-2"></i>Toon alle
          </RouterLink>
        </div>
        <div
          class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
        >
          <div v-for="item in likedContent.slice(0, itemsToShow)" class="col">
            <card-component :card="item" />
          </div>
          <div v-if="!likedContent.length" class="col">
            <div>Geen gelikete items gevonden.</div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="d-flex gap-3 align-items-center mb-3">
          <h2 class="fs-5 fw-bold m-0">Beheer jouw data</h2>
        </div>
        <div class="row gy-3">
          <ManageData />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import ManageData from "@/components/ManageData.vue";
import Playlist from "@/components/Playlist.vue";
import Profile from "@/components/Profile.vue";
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
