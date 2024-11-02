<template>
  <div id="playlist-modal" aria-hidden="true" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-xs">
      <div v-if="!create" class="modal-content bg-body border-0">
        <div class="modal-header p-4 pb-3 border-0">
          <h1 class="modal-title fs-6">Opslaan in...</h1>
          <button
            ref="close"
            aria-label="Close"
            class="btn-close"
            data-bs-dismiss="modal"
            type="button"
          ></button>
        </div>
        <div class="modal-body p-4 pt-0">
          <div v-for="(i, idx) in playlists" :key="idx" class="mb-2">
            <div class="form-check">
              <input
                :id="'box-' + idx"
                :checked="getValue(i.items)"
                :value="'list' + idx"
                class="form-check-input me-3"
                name="playlist"
                type="checkbox"
                @change="toggle($event, i.title)"
              />
              <label :for="'box-' + idx" class="form-check-label fw-lighter small">
                {{ i.title }}
              </label>
            </div>
          </div>

          <div class="text-center mt-4">
            <button class="btn btn-dark rounded-pill" type="button" @click="create = true">
              <i class="bi bi-plus-lg me-2"></i>Nieuwe afspeellijst
            </button>
          </div>
        </div>
      </div>
      <div v-else class="modal-content bg-body border-0">
        <form class="modal-body p-4" @submit.prevent="createList">
          <button ref="close" class="d-none" data-bs-dismiss="modal"></button>
          <h1 class="mb-3 fs-5">Nieuwe afspeellijst</h1>
          <div class="form-floating mb-3">
            <input
              id="playlistTitle"
              v-model="listName"
              :class="{ 'is-invalid': isInvalid }"
              class="form-control bg-transparent"
              placeholder=""
              required
              type="text"
            />
            <label class="bg-transparent" for="playlistTitle">Kies een titel</label>
            <div v-if="isInvalid" class="d-block invalid-feedback">Deze titel bestaat al.</div>
          </div>
          <div class="d-flex gap-2 w-100">
            <button
              class="btn btn-dark rounded-pill w-100"
              data-bs-dismiss="modal"
              type="button"
              @click="create = false"
            >
              Annuleer
            </button>
            <button :disabled="isInvalid" class="btn btn-dark rounded-pill w-100" type="submit">
              Maken
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

const generalStore = useGeneralStore();
const { playlists } = storeToRefs(generalStore);

const props = defineProps({
  id: { type: String, required: false },
});

const close = ref(null);
const create = ref(false);
const listName = ref("");

/**
 * Check if name already exists.
 * @type {ComputedRef<*>}
 */
const isInvalid = computed(() => {
  return playlists.value.some((pl) => pl.title.toLowerCase() === listName.value.toLowerCase());
});

/**
 * Create a new playlist and add current item.
 */
function createList() {
  close.value.click(); //hide modal
  generalStore.createPlaylist(listName.value); //create new list
  generalStore.togglePlaylistItem(listName.value, props.id); //add item to new list
  create.value = false;
  listName.value = "";
}

/**
 * Toggle item in playlist.
 * @param event
 * @param title
 */
function toggle(event, title) {
  generalStore.togglePlaylistItem(title, props.id);
}

function getValue(items) {
  return items.includes(props.id);
}

watch(
  () => props.id,
  () => {
    create.value = false;
  },
);
</script>

<style lang="sass" scoped>
.form-floating > .form-control:focus ~ label::after,
.form-floating > .form-control:not(:placeholder-shown) ~ label::after
  background-color: transparent
</style>
