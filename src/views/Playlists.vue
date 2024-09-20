<template>
  <!-- main -->
  <main class="pt-3 pb-5">
    <div class="row">
      <div class="col-12">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><RouterLink :to="{ name: 'you' }">You</RouterLink></li>
            <li class="breadcrumb-item active" aria-current="page">Playlists</li>
          </ol>
        </nav>

        <h1 class="fw-bold mb-4">Playlists</h1>
        <select v-model="sort" class="form-select mb-4 w-auto">
          <option value="alphaAsc">A-Z</option>
          <option value="alphaDesc">Z-A</option>
          <option value="itemsAsc">Most items</option>
          <option value="itemsDesc">Least items</option>
        </select>
        <div
          class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
        >
          <div v-for="(item, idx) in sortedPlaylists" :key="idx" class="col">
            <Playlist :playlist="item" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import Playlist from "@/components/Playlist.vue";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const generalStore = useGeneralStore();
const { playlists } = storeToRefs(generalStore);

const sort = ref("alphaAsc");

/**
 * Return sorted list of playlists.
 * @type {ComputedRef<*>}
 */
const sortedPlaylists = computed(() => {
  return playlists.value.sort((a, b) => {
    if (sort.value === "alphaAsc") {
      return a.title.localeCompare(b.title);
    } else if (sort.value === "alphaDesc") {
      return b.title.localeCompare(a.title);
    } else if (sort.value === "itemsAsc") {
      return b.items.length - a.items.length;
    } else if (sort.value === "itemsDesc") {
      return a.items.length - b.items.length;
    }
  });
});
</script>
