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
        :end-date="key + '-12-31'"
        :show-legend="false"
        :values="value.dates"
        class="heatmap"
        :dark-mode="theme === 'dark'"
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
      <div class="modal fade" id="multiItemModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xs">
          <div class="modal-content bg-body border-0">
            <div class="modal-header border-0">
              <h1 class="modal-title fs-5">Selecteer een item...</h1>
              <button
                ref="closeBtn"
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="d-flex flex-wrap gap-3">
                <button
                  v-for="item in titles"
                  @click="open(item.id, 'left')"
                  @click.middle="open(item.id, 'middle')"
                  class="btn btn-dark border-0 text-truncate"
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

<script setup>
import CalendarHeatmap from "@/components/Heatmap/CalendarHeatmap.vue";
import router from "@/router/index.js";
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { computed, onActivated, ref } from "vue";

const contentStore = useContentStore();
const generalStore = useGeneralStore();
const { selectedCardId } = storeToRefs(contentStore);
const { theme } = storeToRefs(generalStore);

const multiItemBtn = ref(null);
const closeBtn = ref(null);
const titles = ref([]);

/**
 * Navigate to item
 */
function goToCard(day, type) {
  if (!day.id) return;

  if (day.id.length > 1) {
    titles.value = [];
    day.id.forEach((id) => {
      titles.value.push({
        id: id,
        title: contentStore.getCardTitle(contentStore.getSingleCard(id)),
      });
    });
    multiItemBtn.value?.click();
  } else {
    open(day.id[0], type);
  }
}

function open(id, type) {
  closeBtn.value?.click();
  const path = `/item/${id}`;
  if (type === "middle") {
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
