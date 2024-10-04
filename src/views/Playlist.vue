<template>
  <main class="pt-3 pb-5">
    <div class="row">
      <div class="col-12">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><RouterLink :to="{ name: 'you' }">Jij</RouterLink></li>
            <li class="breadcrumb-item">
              <RouterLink :to="{ name: 'playlists' }">Afspeellijsten</RouterLink>
            </li>
            <li class="breadcrumb-item active" aria-current="page">{{ playlist.title }}</li>
          </ol>
        </nav>

        <h1 class="fw-bold mb-2">{{ playlist.title }}</h1>
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
          class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
        >
          <div v-for="(item, idx) in sortedItems" :key="idx" class="col-6">
            <Card :card="item" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import Card from "@/components/Card.vue";
import SortSelect from "@/components/SortSelect.vue";
import { useGeneralStore } from "@/stores/general.js";
import { computed, onBeforeMount, ref } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";

const generalStore = useGeneralStore();

const route = useRoute();
const items = ref([]);
const playlist = ref(null);
const sort = ref("newOld");
const sortOptions = [
  { value: "newOld", label: "Upload datum (nieuwste eerst)" },
  { value: "oldNew", label: "Upload datum (oudste eerst)" },
  { value: "shortLong", label: "Duur (kortste eerst)" },
  { value: "longShort", label: "Duur (langste eerst)" },
];

/**
 * Return sorted list of playlist items.
 * @type {ComputedRef<*>}
 */
const sortedItems = computed(() => {
  return items.value.sort((a, b) => {
    let dateA = new Date(a.date);
    let dateB = new Date(b.date);

    if (sort.value === "oldNew") {
      return dateA - dateB;
    } else if (sort.value === "newOld") {
      return dateB - dateA;
    } else if (sort.value === "shortLong") {
      return a.duration - b.duration;
    } else if (sort.value === "longShort") {
      return b.duration - a.duration;
    }
  });
});

onBeforeMount(() => {
  playlist.value = generalStore.getPlaylist(route.params.title);
  items.value = generalStore.getPlaylistItems(playlist.value["items"]);
});

onBeforeRouteUpdate((to, from) => {
  playlist.value = generalStore.getPlaylist(to.params.title);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
</script>
