<template>
  <!-- main -->
  <main class="pb-5">
    <div class="d-none d-sm-flex sticky-top z-1 bg-body row align-items-center g-2 py-3">
      <div class="col-auto">
        <div class="btn-group btn-group-sm overflow-hidden">
          <button
            :class="{ active: homeView === 'thumbnail' }"
            class="btn btn-dark border-0"
            title="Thumbnail view"
            type="button"
            @click="layoutStore.setHomeView('thumbnail')"
          >
            <i class="bi bi-images"></i>
          </button>
          <button
            :class="{ active: homeView === 'heatmap' }"
            class="btn btn-dark border-0"
            title="Heatmap view"
            type="button"
            @click="layoutStore.setHomeView('heatmap')"
          >
            <i class="bi bi-calendar3"></i>
          </button>
          <button
            :class="{ active: homeView === 'random' }"
            class="btn btn-dark border-0"
            title="Random view"
            type="button"
            @click="layoutStore.setHomeView('random')"
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
      <div class="col-auto">
        <span class="d-flex align-items-baseline gap-2">
          <span class="badge rounded-pill text-bg-warning">Let op!</span>
          <span class="small"
            >Vanaf 19 mei 2025 zullen veel Twitch links helaas niet meer werken.
            <img height="20" src="@/assets/img/lekkerAppie_V2.png" alt="lekker_appie" /> Lees
            <a
              href="https://help.twitch.tv/s/article/video-on-demand?language=nl_NL"
              target="_blank"
              >hier</a
            >
            meer.</span
          >
        </span>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-sm">
        <span class="d-block d-sm-none mb-2 small">
          <span class="badge rounded-pill text-bg-warning">Let op!</span>
          Vanaf 19 mei 2025 zullen veel Twitch links helaas niet meer werken.
          <img height="20" src="@/assets/img/lekkerAppie_V2.png" alt="lekker_appie" /> Lees
          <a href="https://help.twitch.tv/s/article/video-on-demand?language=nl_NL" target="_blank"
            >hier</a
          >
          meer.
        </span>
        <keep-alive>
          <List v-if="homeView === 'thumbnail'" />
          <CalendarHeatmap v-else-if="homeView === 'heatmap'" />
          <Random v-else-if="homeView === 'random'" />
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
import { onBeforeRouteLeave } from "vue-router";

const contentStore = useContentStore();
const layoutStore = useLayoutStore();
const { sortedData } = storeToRefs(contentStore);
const { homeView } = storeToRefs(layoutStore);

onBeforeRouteLeave(() => {
  layoutStore.homeScroll = document.getElementById("main-content").scrollTop;
});
</script>

<style scoped></style>
