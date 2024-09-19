<template>
  <div class="modal fade" id="playlist-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h1 class="modal-title fs-6 me-2">Save to...</h1>
          <button
            ref="close"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <span class="small">{{ selectedCardTitle }}</span>
          <div v-for="(i, idx) in playlists" class="py-2" :key="idx">
            <div class="form-check">
              <input
                @change="toggle($event, i.title)"
                name="playlist"
                class="form-check-input"
                type="checkbox"
                :id="'box-' + idx"
                :checked="getValue(i.items)"
                :value="'list' + idx"
              />
              <label class="form-check-label" :for="'box-' + idx">
                {{ i.title }}
              </label>
            </div>
          </div>
          <div @click="create = true" class="mt-3" type="button" v-if="!create">
            <i class="bi bi-plus-lg me-2"></i>Maak nieuwe afspeellijst
          </div>
          <div v-else class="mt-3">
            <form @submit.prevent="createList">
              <div class="mb-3">
                <label for="newListName" class="form-label small">Name</label>
                <input
                  v-model="listName"
                  type="text"
                  class="form-control"
                  id="newListName"
                  placeholder="Enter playlist title..."
                  required
                />
              </div>
              <button type="submit" class="btn btn-sm btn-outline-primary rounded-pill float-end">
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const generalStore = useGeneralStore();
const contentStore = useContentStore();
const { playlists } = storeToRefs(generalStore);
const { selectedCardTitle } = storeToRefs(contentStore);

const props = defineProps({
  id: { type: String, required: false },
});

const close = ref(null);
const create = ref(false);
const listName = ref("");

/**
 * Create a new playlist and add current item.
 */
function createList() {
  close.value.click(); //hide modal
  generalStore.createPlaylist(listName.value); //create new list
  generalStore.togglePlaylistItem(listName.value, props.id); //add item to new list
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
</script>

<style scoped></style>
