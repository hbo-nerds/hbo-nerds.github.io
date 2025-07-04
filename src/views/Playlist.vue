<template>
    <main class="pt-3 pb-5">
        <div class="row">
            <div v-if="!playlist" class="col-12">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <RouterLink :to="{ name: 'you' }">Jij</RouterLink>
                        </li>
                        <li class="breadcrumb-item">
                            <RouterLink :to="{ name: 'playlists' }">Afspeellijsten</RouterLink>
                        </li>
                        <li aria-current="page" class="breadcrumb-item active">
                            {{ route.params.title }}
                        </li>
                    </ol>
                </nav>

                <h1 class="fw-bold mb-2">Afspeellijst niet gevonden</h1>
            </div>
            <div v-else class="col-12">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <RouterLink :to="{ name: 'you' }">Jij</RouterLink>
                        </li>
                        <li class="breadcrumb-item">
                            <RouterLink :to="{ name: 'playlists' }">Afspeellijsten</RouterLink>
                        </li>
                        <li aria-current="page" class="breadcrumb-item active">
                            {{ playlist.title }}
                        </li>
                    </ol>
                </nav>

                <h1 class="fw-bold mb-2">{{ playlist.title }}</h1>
                <p v-if="playlist.description">{{ playlist.description }}</p>
                <div class="d-flex gap-2 mb-3">
                    <button
                        class="btn btn-sm btn-dark border-0 rounded-pill"
                        data-bs-target="#edit-playlist-modal"
                        data-bs-toggle="modal"
                        type="button"
                        @click="editPlaylistTitle = playlist.title"
                    >
                        <i class="bi bi-pencil me-2"></i>Bewerken
                    </button>
                    <button
                        class="btn btn-sm btn-dark border-0 rounded-pill"
                        data-bs-target="#share-playlist-modal"
                        data-bs-toggle="modal"
                        type="button"
                        @click="sharePlaylistTitle = playlist.title"
                    >
                        <i class="bi bi-share me-2"></i>Delen
                    </button>
                </div>
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
                    :class="
                        selectedCard
                            ? 'row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-3xl-4 row-cols-4xl-6'
                            : 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6'
                    "
                    class="row g-4"
                >
                    <div v-for="card in sortedItems" :key="card.id" class="col">
                        <Card :card="card" />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import Card from "@/components/Card.vue";
import SortSelect from "@/components/SortSelect.vue";
import { useContentStore } from "@/stores/content.ts";
import { useGeneralStore } from "@/stores/general.ts";
import type { Card as TypeCard } from "@/types/Card.ts";
import { storeToRefs } from "pinia";
import { computed, onActivated, onBeforeMount, ref } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";

const generalStore = useGeneralStore();
const contentStore = useContentStore();
const { sharePlaylistTitle, editPlaylistTitle, selectedCard } = storeToRefs(contentStore);

const route = useRoute();
const items = ref<TypeCard[]>([]);

const sort = ref<string>("newOld");
const sortOptions: { value: string; label: string }[] = [
    { value: "newOld", label: "Upload datum (nieuwste eerst)" },
    { value: "oldNew", label: "Upload datum (oudste eerst)" },
    { value: "shortLong", label: "Duur (kortste eerst)" },
    { value: "longShort", label: "Duur (langste eerst)" },
];

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
 * Get playlist by title
 * @type {ComputedRef<CharCode.T>}
 */
const playlist = computed(() => {
    return generalStore.getPlaylist(route.params.title as string);
});

function prepare() {
    if (playlist.value) items.value = generalStore.getPlaylistItems(playlist.value.items);
}

onActivated(() => {
    prepare();
});

onBeforeMount(() => {
    prepare();
});

onBeforeRouteUpdate((to, from) => {
    prepare();
    window.scrollTo({ top: 0, behavior: "smooth" });
});
</script>
