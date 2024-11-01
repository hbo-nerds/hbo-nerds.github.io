<template>
  <button
    class="btn btn-dark bg-trans btn-circle rounded-circle border-0"
    :data-bs-target="'#' + prefix + 'filterModal'"
    data-bs-toggle="modal"
    title="Geavanceerde filter"
    type="button"
    @click="checkVisibility"
  >
    <i class="bi bi-sliders2"></i>
  </button>

  <!-- Modal -->
  <teleport to="body">
    <div :id="prefix + 'filterModal'" aria-hidden="true" class="modal fade" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-lg-down">
        <div class="modal-content bg-body border-0">
          <div class="modal-header border-0 px-4">
            <h1 class="modal-title fs-5">Geavanceerde filters</h1>
            <button
              aria-label="Close"
              class="btn-close"
              data-bs-dismiss="modal"
              type="button"
            ></button>
          </div>
          <div class="modal-body px-4">
            <Filter v-if="visible" :prefix="mob ? 'mob-' : ''" />
          </div>
          <div class="modal-footer px-4">
            <div class="d-flex gap-2 w-100">
              <button
                class="btn btn-dark border-0 rounded-3 w-100"
                type="button"
                @click="content.resetFilters"
              >
                Reset filters
              </button>
              <button
                aria-label="Close"
                class="btn btn-dark border-0 rounded-3 w-100"
                data-bs-dismiss="modal"
                type="button"
              >
                Sluit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import Filter from "@/components/Filter.vue";
import { useContentStore } from "@/stores/content.js";
import { ref } from "vue";

const props = defineProps({
  prefix: { type: String },
});

const content = useContentStore();
const visible = ref(false);

/**
 * Check if filter modal is currently visible
 */
function checkVisibility() {
  setTimeout(() => {
    visible.value = document
      .getElementById(props.prefix + "filterModal")
      .classList.contains("show");
  }, 200);
}
</script>

<style scoped></style>
