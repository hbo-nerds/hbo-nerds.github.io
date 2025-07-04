<template>
    <main class="pt-3 pb-5">
        <div class="row">
            <div class="col-12">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item active">Gedeelde afspeellijst</li>
                        <li aria-current="page" class="breadcrumb-item active">
                            {{ route.query.title }}
                        </li>
                    </ol>
                </nav>

                <h1 class="fw-bold mb-2">{{ route.query.title }}</h1>
                <p v-if="route.query.description">{{ route.query.description }}</p>
                <button
                    class="btn btn-sm btn-dark border-0 rounded-pill mb-3"
                    data-bs-target="#playlist-copy"
                    data-bs-toggle="modal"
                    type="button"
                >
                    <i class="bi bi-bookmark me-2"></i>Bewaren
                </button>
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
                    <div v-for="(item, idx) in sortedItems" :key="idx" class="col">
                        <Card :card="item" />
                    </div>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <div id="playlist-copy" aria-hidden="true" class="modal fade" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-xs">
                    <div class="modal-content bg-body border-0">
                        <div class="modal-header border-0">
                            <h1 class="modal-title fs-5">Bewaar afspeellijst</h1>
                            <button
                                ref="close"
                                aria-label="Close"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                type="button"
                            ></button>
                        </div>
                        <form class="modal-body" @submit.prevent="createList">
                            <button ref="close" class="d-none" data-bs-dismiss="modal"></button>
                            <div class="form-floating mb-3">
                                <input
                                    id="sharedPlaylistTitle"
                                    v-model="listName"
                                    :class="{ 'is-invalid': isInvalid }"
                                    class="form-control bg-transparent"
                                    maxlength="100"
                                    placeholder=""
                                    required
                                    type="text"
                                />
                                <label class="bg-transparent" for="sharedPlaylistTitle"
                                    >Kies een titel</label
                                >
                                <div class="d-flex justify-content-between mt-1">
                                    <div v-if="isInvalid" class="d-block invalid-feedback m-0">
                                        Deze titel bestaat al.
                                    </div>
                                    <small class="ms-auto">{{ listName.length }}/100</small>
                                </div>
                            </div>
                            <button
                                :disabled="isInvalid"
                                class="btn btn-dark rounded-pill w-100"
                                type="submit"
                            >
                                Maken
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Teleport>
    </main>
</template>

<script lang="ts" setup>
import Card from "@/components/Card.vue";
import SortSelect from "@/components/SortSelect.vue";
import { useGeneralStore } from "@/stores/general.ts";
import type { Card as TypeCard } from "@/types/Card.ts";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const generalStore = useGeneralStore();
const { playlists } = storeToRefs(generalStore);

const route = useRoute();
const items = ref<TypeCard[]>([]);

const sort = ref<string>("newOld");
const sortOptions: { value: string; label: string }[] = [
    { value: "newOld", label: "Upload datum (nieuwste eerst)" },
    { value: "oldNew", label: "Upload datum (oudste eerst)" },
    { value: "shortLong", label: "Duur (kortste eerst)" },
    { value: "longShort", label: "Duur (langste eerst)" },
];

const close = ref<HTMLButtonElement | null>(null);
const listName = ref<string>("");

/**
 * Return sorted list of playlist items.
 * @type {ComputedRef<*>}
 */
const sortedItems = computed(() => {
    return items.value.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        switch (sort.value) {
            case "oldNew":
                return dateA - dateB;
            case "newOld":
                return dateB - dateA;
            case "shortLong":
                return a.duration - b.duration;
            case "longShort":
                return b.duration - a.duration;
            default:
                return 0;
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
    close.value?.click();
    generalStore.copyPlaylist({ title: listName.value, items: items.value.map((i) => i.id) });
    listName.value = "";
}

onBeforeMount(() => {
    const itemsParam = typeof route.query.items === "string" ? route.query.items : "";
    const matchedIds = itemsParam.match(/.{1,4}/g) ?? [];
    items.value = generalStore.getPlaylistItems(matchedIds);
});
</script>

<style lang="sass" scoped>
.form-floating > .form-control:focus ~ label::after,
.form-floating > .form-control:not(:placeholder-shown) ~ label::after
  background-color: transparent
</style>
