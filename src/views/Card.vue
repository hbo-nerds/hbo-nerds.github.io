<template>
    <div class="container-fluid py-4">
        <div class="row gy-3 justify-content-center">
            <div class="col-12 col-md-8 col-xl-4 mb-md-0">
                <SingleCard v-if="card" :card="card" :show-close-btn="false" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import SingleCard from "@/components/SingleCard.vue";
import { useContentStore } from "@/stores/content.ts";
import { onBeforeMount, ref } from "vue";

import type { Card } from "@/types/Card.ts";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
const route = useRoute();
const card = ref<Card | null>(null);

const contentStore = useContentStore();

onBeforeMount(() => {
    card.value = contentStore.getSingleCard(route.params.id as string);
});

onBeforeRouteUpdate((to, from) => {
    card.value = contentStore.getSingleCard(to.params.id as string);
    window.scrollTo({ top: 0, behavior: "smooth" });
});
</script>
