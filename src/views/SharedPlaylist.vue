<template>
  <main class="pt-3 pb-5">
    <div class="row">
      <div class="col-12">
        <div class="d-flex align-items-center gap-3 mb-2">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item active">Gedeelde afspeellijst</li>
              <li aria-current="page" class="breadcrumb-item active">{{ playlist.title }}</li>
            </ol>
          </nav>
          <button
            class="btn btn-sm btn-dark border-0 rounded-pill text-nowrap"
            data-bs-target="#playlist-copy"
            data-bs-toggle="modal"
            type="button"
            @click=""
          >
            <i class="bi bi-bookmark me-2"></i>Bewaren
          </button>
        </div>

        <h1 class="fw-bold mb-2">{{ playlist.title }}</h1>
        <SortSelect
          :active="sort"
          :sort-options="sortOptions"
          class="mb-4"
          @select="
            (val) => {
              sort = val;
            }
          "
        />
        <div
          class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
        >
          <div v-for="(item, idx) in sortedItems" :key="idx" class="col-6">
            <Card :card="item" />
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div id="playlist-copy" aria-hidden="true" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-xs">
          <div class="modal-content bg-body border-0">
            <form class="modal-body p-4" @submit.prevent="createList">
              <h1 class="mb-3 fs-5">Nieuwe afspeellijst</h1>
              <div class="form-floating mb-3">
                <input
                  v-model="listName"
                  type="text"
                  :class="{ 'is-invalid': isInvalid }"
                  class="form-control bg-transparent"
                  id="playlistTitle"
                  placeholder=""
                  required
                />
                <label class="bg-transparent" for="playlistTitle">Kies een titel</label>
                <div v-if="isInvalid" class="d-block invalid-feedback">Deze titel bestaat al.</div>
              </div>
              <div class="d-flex gap-2 w-100">
                <button
                  class="btn btn-dark rounded-pill w-100"
                  data-bs-dismiss="modal"
                  type="button"
                >
                  Annuleer
                </button>
                <button class="btn btn-dark rounded-pill w-100" :disabled="isInvalid" type="submit">
                  Maken
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import Card from "@/components/Card.vue";
import SortSelect from "@/components/SortSelect.vue";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import router from "@/router/index.js";

const generalStore = useGeneralStore();
const { playlists } = storeToRefs(generalStore);

const route = useRoute();
const items = ref([]);
const playlist = ref(null);
const sort = ref("newOld");
const sortOptions = [
  { value: "newOld", label: "Upload datum (nieuwste eerst)" },
  { value: "oldNew", label: "Upload datum (oudste eerst)" },
  { value: "shortLong", label: "Duur (kortste eerst)" },
  { value: "longShort", label: "Duur (langste eerst)" },
];

const close = ref(null);
const listName = ref("");

/**
 * Return sorted list of playlist items.
 * @type {ComputedRef<*>}
 */
const sortedItems = computed(() => {
  return items.value.sort((a, b) => {
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

/**
 * Check if name already exists.
 * @type {ComputedRef<*>}
 */
const isInvalid = computed(() => {
  return playlists.value.some((pl) => pl.title.toLowerCase() === listName.value.toLowerCase());
});

/**
 * Copy the playlist.
 */
function createList() {
  close.value.click(); //hide modal
  generalStore.copyPlaylist({ title: listName.value, items: items.value.map((i) => i.id) });
  listName.value = "";
}

onBeforeMount(() => {
  playlist.value = generalStore.getPlaylist(route.query.title);
  items.value = generalStore.getPlaylistItems(route.query.items);
});
</script>

<style scoped lang="sass">
.form-floating > .form-control:focus ~ label::after,
.form-floating > .form-control:not(:placeholder-shown) ~ label::after
    background-color: transparent
</style>
