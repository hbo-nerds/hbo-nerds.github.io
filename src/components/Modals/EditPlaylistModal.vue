<template>
  <div id="edit-playlist-modal" aria-hidden="true" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-xs">
      <div class="modal-content bg-body border-0">
        <div class="modal-header border-0">
          <h1 class="modal-title fs-5">Bewerk afspeellijst</h1>
          <button
            ref="close"
            aria-label="Close"
            class="btn-close"
            data-bs-dismiss="modal"
            type="button"
          ></button>
        </div>
        <form class="modal-body" @submit.prevent="savePlaylist">
          <div class="form-floating mb-3">
            <input
              id="playlistTitle"
              v-model="playlistCopy['title']"
              :class="{ 'is-invalid': isInvalid }"
              class="form-control bg-transparent"
              maxlength="100"
              placeholder=""
              required
              type="text"
            />
            <label class="bg-transparent" for="playlistTitle">Kies een titel</label>
            <div class="d-flex justify-content-between mt-1">
              <div v-if="isInvalid" class="d-block invalid-feedback m-0">
                Deze titel bestaat al.
              </div>
              <small class="ms-auto">{{ playlistCopy["title"].length }}/100</small>
            </div>
          </div>
          <div class="form-floating mb-3">
            <textarea
              id="description"
              v-model="playlistCopy['description']"
              class="form-control bg-transparent"
              maxlength="255"
              style="height: 100px"
            ></textarea>
            <label for="description">Omschrijving</label>
            <div class="d-flex justify-content-between mt-1">
              <div v-if="isInvalid" class="d-block invalid-feedback m-0">
                Deze titel bestaat al.
              </div>
              <small class="ms-auto">{{ playlistCopy["description"].length }}/255</small>
            </div>
          </div>
          <button :disabled="isInvalid" class="btn btn-dark rounded-pill w-100" type="submit">
            Opslaan
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps({
  title: { type: String, required: false },
});

const generalStore = useGeneralStore();
const { playlists } = storeToRefs(generalStore);

const close = ref(null);
const playlistCopy = ref({
  title: "",
  description: "",
});

/**
 * Get the playlist object by title
 * @type {ComputedRef<CharCode.T|null>}
 */
const playlist = computed(() => {
  return props.title ? generalStore.getPlaylist(props.title) : null;
});

/**
 * Check if name already exists.
 * @type {ComputedRef<*>}
 */
const isInvalid = computed(() => {
  return playlists.value.some(
    (pl) =>
      pl.title.toLowerCase() === playlistCopy.value.title.toLowerCase() &&
      props.title.toLowerCase() !== playlistCopy.value.title.toLowerCase(),
  );
});

/**
 * Create a new playlist and add current item.
 */
function savePlaylist() {
  close.value.click();
  generalStore.editPlaylist(props.title, playlistCopy.value);
}

onMounted(() => {
  if (playlist.value) playlistCopy.value = { ...playlistCopy.value, ...playlist.value };
});

watch(
  () => props.title,
  () => {
    if (playlist.value) playlistCopy.value = { ...playlistCopy.value, ...playlist.value };
  },
);
</script>

<style lang="sass" scoped>
.form-floating > .form-control:focus ~ label::after,
.form-floating > .form-control:not(:placeholder-shown) ~ label::after
  background-color: transparent
</style>
