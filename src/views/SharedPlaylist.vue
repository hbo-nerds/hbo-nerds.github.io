<template>
  <main class="pt-3 pb-5">
    <div class="row">
      <div class="col-12">
        <div class="bg-body-secondary rounded-3 py-3 px-4 mb-3">
          <strong>Opmerking:</strong> Dit is een gedeelde lijst en is gemaakt door een andere
          gebruiker. Wil je deze lijst bewaren? Klik dan
          <a
            type="button"
            data-bs-target="#playlist-copy"
            data-bs-toggle="modal"
            class="link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
            >hier </a
          >.
        </div>
        <h1 class="fw-bold mb-2">Gedeeld: {{ playlist.title }}</h1>
        <SortSelect
          class="mb-4"
          :sort-options="sortOptions"
          :active="sort"
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
      <div class="modal fade" id="playlist-copy" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xs">
          <div class="modal-content bg-body border-0">
            <div class="modal-header border-0">
              <h1 class="modal-title fs-5">Kopieer afspeellijst</h1>
              <button
                ref="close"
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p>Geef je afspeellijst een eigen naam.</p>
              <form @submit.prevent="createList">
                <div class="mb-3">
                  <label for="newListName" class="form-label small">Naam</label>
                  <input
                    v-model="listName"
                    type="text"
                    class="form-control"
                    id="newListName"
                    placeholder="Titel van de afspeellijst..."
                    required
                  />
                  <div v-if="alreadyExists" class="d-block invalid-feedback">Naam bestaat al.</div>
                </div>
                <button
                  :disabled="alreadyExists"
                  type="submit"
                  class="btn btn-sm btn-outline-primary rounded-pill float-end"
                >
                  Creëren
                </button>
              </form>
            </div>
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
const alreadyExists = computed(() => {
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

<style scoped></style>
