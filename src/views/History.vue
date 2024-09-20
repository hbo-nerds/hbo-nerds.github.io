<template>
  <!-- main -->
  <main class="pt-3 pb-5">
    <div class="row">
      <div class="col-12">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <RouterLink :to="{ name: 'you' }">You</RouterLink>
            </li>
            <li aria-current="page" class="breadcrumb-item active">History</li>
          </ol>
        </nav>

        <h1 class="fw-bold mb-4">History</h1>
        <select v-model="sort" class="form-select mb-4 w-auto">
          <option value="newOld">Upload date (new first)</option>
          <option value="oldNew">Upload date (old first)</option>
          <option value="shortLong">Duration (shortest first)</option>
          <option value="longShort">Duration (longest first)</option>
        </select>
        <div
          class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
        >
          <div v-for="(item, idx) in sortedHistory" :key="idx" class="col">
            <Card :card="item" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import Card from "@/components/Card.vue";
import { useContentStore } from "@/stores/content.js";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const contentStore = useContentStore();
const { historyContent } = storeToRefs(contentStore);

const sort = ref("newOld");

/**
 * Return sorted list of playlists.
 * @type {ComputedRef<*>}
 */
const sortedHistory = computed(() => {
  return historyContent.value.sort((a, b) => {
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
</script>
