<template>
  <!-- main -->
  <main class="pb-5">
    <div class="sticky-top z-3 bg-body row align-items-center gx-3 py-2">
      <div class="col-auto">
        <div class="btn-group overflow-hidden">
          <button
            :class="{ active: view === 'thumbnail' }"
            class="btn btn-dark border-0"
            title="Thumbnail view"
            type="button"
            @click="changeView('thumbnail')"
          >
            <i class="bi bi-images"></i>
          </button>
          <button
            :class="{ active: view === 'heatmap' }"
            class="btn btn-dark border-0"
            title="Heatmap view"
            type="button"
            @click="changeView('heatmap')"
          >
            <i class="bi bi-calendar3"></i>
          </button>
          <button
            :class="{ active: view === 'random' }"
            class="btn btn-dark border-0"
            title="Random view"
            type="button"
            @click="changeView('random')"
          >
            <i class="bi bi-dice-5"></i>
          </button>
        </div>
      </div>
      <FilterHorizontal />
      <div class="col-auto">
        <span class="small"
          >{{ sortedData.length }} {{ sortedData.length === 1 ? "resultaat" : "resultaten" }}</span
        >
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-sm">
        <keep-alive>
          <List v-if="view === 'thumbnail'" />
          <CalendarHeatmap v-else-if="view === 'heatmap'" />
          <Random v-else-if="view === 'random'" />
        </keep-alive>
      </div>
    </div>
  </main>
</template>

<script setup>
import FilterHorizontal from "@/components/FilterHorizontal.vue";
import { useContentStore } from "@/stores/content.js";
import { useLayoutStore } from "@/stores/layout.js";
import CalendarHeatmap from "@/views/CalendarHeatmap.vue";
import List from "@/views/List.vue";
import Random from "@/views/Random.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const contentStore = useContentStore();
const layoutStore = useLayoutStore();
const { sortedData } = storeToRefs(contentStore);
const view = ref("thumbnail");

function changeView(newView) {
  if (view.value === "thumbnail")
    layoutStore.homeScroll = document.getElementById("main-content").scrollTop;
  view.value = newView;
}

onBeforeRouteLeave(() => {
  layoutStore.homeScroll = document.getElementById("main-content").scrollTop;
});
</script>

<style scoped></style>
