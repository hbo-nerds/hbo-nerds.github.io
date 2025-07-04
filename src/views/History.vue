<template>
    <!-- main -->
    <main class="pt-3 pb-5">
        <div class="row">
            <div class="col-12">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <RouterLink :to="{ name: 'you' }">Jij</RouterLink>
                        </li>
                        <li aria-current="page" class="breadcrumb-item active">Geschiedenis</li>
                    </ol>
                </nav>

                <h1 class="fw-bold mb-2">Geschiedenis</h1>
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
                    class="row g-4"
                    :class="
                        selectedCard
                            ? 'row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-3xl-4 row-cols-4xl-6'
                            : 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6'
                    "
                >
                    <div v-for="(item, idx) in sortedHistory" :key="idx" class="col">
                        <Card :card="item" />
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
import { type Card as TypeCard } from "@/types/Card";
import { storeToRefs } from "pinia";
import { computed, type ComputedRef, ref } from "vue";

const contentStore = useContentStore();
const { historyContent, selectedCard } = storeToRefs(contentStore);

const sort = ref<string>("newOld");
const sortOptions: { value: string; label: string }[] = [
    { value: "newOld", label: "Upload datum (nieuwste eerst)" },
    { value: "oldNew", label: "Upload datum (oudste eerst)" },
    { value: "shortLong", label: "Duur (kortste eerst)" },
    { value: "longShort", label: "Duur (langste eerst)" },
];

/**
 * Return a sorted list of playlists.
 * @type {ComputedRef<*>}
 */
const sortedHistory: ComputedRef<TypeCard[]> = computed(() => {
    return historyContent.value.sort((a, b) => {
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
</script>
