<template>
    <!-- main -->
    <main class="pb-5">
        <div
            class="d-none d-sm-flex align-items-center flex-wrap gap-2 sticky-top z-1 bg-body py-3"
        >
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
            <FilterHorizontal />
            <span class="small">
                {{ sortedData.length }}
                {{ sortedData.length === 1 ? "resultaat" : "resultaten" }}
            </span>

            <div style="width: 1px; height: 16px; background-color: #404040"></div>

            <MalmaarmalsBanner />
        </div>

        <div class="row">
            <div class="col-12 col-sm">
                <MalmaarmalsBanner class="d-block d-sm-none mb-2" />

                <keep-alive>
                    <List v-if="homeView === 'thumbnail'" />
                    <CalendarHeatmap v-else-if="homeView === 'heatmap'" />
                    <Random v-else-if="homeView === 'random'" />
                </keep-alive>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import FilterHorizontal from "@/components/FilterHorizontal.vue";
import MalmaarmalsBanner from "@/components/MalmaarmalsBanner.vue";
import { useContentStore } from "@/stores/content.ts";
import { useLayoutStore } from "@/stores/layout.ts";
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
    layoutStore.homeScroll = document.getElementById("main-content")?.scrollTop ?? 0;
});
</script>
