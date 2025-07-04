<template>
    <div>
        <span class="d-inline-flex align-items-baseline gap-2 mb-3">
            <span class="badge rounded-pill text-bg-warning">Let op!</span>
            <span class="fw-lighter small">De heatmap maakt gebruik van de huidige filters.</span>
        </span>
        <div v-for="(value, key, index) in heatmapData" class="overflow-y-auto mb-3">
            <span>{{ key }}</span>
            <CalendarHeatmap
                :key="`${key}_${index}`"
                :dark-mode="theme === 'dark'"
                :end-date="key + '-12-31'"
                :show-legend="false"
                :values="value.dates"
                class="heatmap"
                @day-click="goToCard"
            />
        </div>
        <button
            ref="multiItemBtn"
            class="d-none"
            data-bs-target="#multiItemModal"
            data-bs-toggle="modal"
            type="button"
        ></button>

        <Teleport to="body">
            <div id="multiItemModal" aria-hidden="true" class="modal fade" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-xs">
                    <div class="modal-content bg-body border-0">
                        <div class="modal-header border-0">
                            <h1 class="modal-title fs-5">Selecteer een item...</h1>
                            <button
                                ref="closeBtn"
                                aria-label="Close"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                type="button"
                            ></button>
                        </div>
                        <div class="modal-body">
                            <div class="d-flex flex-wrap gap-3">
                                <button
                                    v-for="item in titles"
                                    class="btn btn-dark border-0 text-truncate"
                                    @click="open(item.id, 'left')"
                                    @click.middle="open(item.id, 'middle')"
                                >
                                    {{ item.title }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
import CalendarHeatmap from "@/components/Heatmap/CalendarHeatmap.vue";
import type { HeatmapValue } from "@/components/Heatmap/Heatmap.ts";
import router from "@/router/index.js";
import { useContentStore } from "@/stores/content.ts";
import { useGeneralStore } from "@/stores/general.ts";
import { storeToRefs } from "pinia";
import { computed, onActivated, ref } from "vue";

const contentStore = useContentStore();
const generalStore = useGeneralStore();
const { selectedCardId } = storeToRefs(contentStore);
const { theme } = storeToRefs(generalStore);

const multiItemBtn = ref<HTMLButtonElement | null>(null);
const closeBtn = ref<HTMLButtonElement | null>(null);
const titles = ref<{ id: string; title: string }[]>([]);

/**
 * Navigates to a card or multiple cards based on the provided day object.
 * Handles single card navigation or opens multiple cards with associated titles.
 *
 * @param {HeatmapValue} day - The heatmap day object containing card identifiers.
 * @param {'middle' | 'left'} clickType - The type of click action to perform (e.g., middle or left click).
 * @return {void} - Does not return a value.
 */
function goToCard(day: HeatmapValue, clickType: "middle" | "left") {
    if (!day.id) return;

    if (day.id.length > 1) {
        titles.value = [];
        day.id.forEach((id) => {
            const card = contentStore.getSingleCard(id);
            titles.value.push({
                id: id,
                title: card ? contentStore.getCardTitle(card) : "",
            });
        });
        multiItemBtn.value?.click();
    } else {
        open(day.id[0], clickType);
    }
}

/**
 * Opens an item based on the given parameters. Handles middle or left click actions,
 * updates the selected card ID, and navigates to the specified route.
 *
 * @param {string} id - The identifier of the item to open.
 * @param {'middle'|'left'} clickType - The type of click action: 'middle' for opening in a new tab, 'left' for selection toggle.
 * @return {void} Does not return a value.
 */
function open(id: string, clickType: "middle" | "left") {
    closeBtn.value?.click();
    const path = `/item/${id}`;
    if (clickType === "middle") {
        const routeData = router.resolve({ path: path });
        window.open(routeData.href, "_blank");
    } else selectedCardId.value = selectedCardId.value === id ? null : id;
}

const heatmapData = computed(() => {
    return contentStore.groupedYearDate;
});

onActivated(() => {
    const el = document.getElementById("main-content");
    if (el) el.scrollTo({ top: 0, behavior: "instant" });
});
</script>

<style lang="sass">
@media (max-width: 576px)
  .heatmap
    min-width: 1000px
</style>
