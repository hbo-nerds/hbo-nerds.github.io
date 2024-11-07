<template>
  <!-- main -->
  <main class="pt-3 pb-5">
    <div class="row">
      <div class="col-12">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><RouterLink :to="{ name: 'you' }">Jij</RouterLink></li>
            <li class="breadcrumb-item active" aria-current="page">Afspeellijsten</li>
          </ol>
        </nav>

        <h1 class="fw-bold mb-2">Afspeellijsten</h1>
        <SortSelect
          class="mb-4"
          :sort-options="sortOptions"
          :active="sort"
          @select="
            (val) => {
              sort = val;
            }
          "
        />
        <div
          class="row g-4"
          :class="
            selectedCard
              ? 'row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-3xl-4 row-cols-4xl-6'
              : 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6'
          "
        >
          <div v-for="(item, idx) in sortedPlaylists" :key="item.title" class="col">
            <Playlist :playlist="item" :key="item.title" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import Playlist from "@/components/Playlist.vue";
import SortSelect from "@/components/SortSelect.vue";
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const contentStore = useContentStore();
const generalStore = useGeneralStore();
const { playlists } = storeToRefs(generalStore);
const { selectedCard } = storeToRefs(contentStore);

const sort = ref("alphaAsc");
const sortOptions = [
  { value: "alphaAsc", label: "A-Z" },
  { value: "alphaDesc", label: "Z-A" },
  { value: "itemsAsc", label: "Meeste items" },
  { value: "itemsDesc", label: "Minste items" },
];

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
