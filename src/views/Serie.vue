<template>
    <main class="pt-3 pb-5">
        <div class="row">
            <div class="col-12">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <router-link :to="{ name: 'series' }">Series</router-link>
                        </li>
                        <li aria-current="page" class="breadcrumb-item active">
                            {{ serie?.title || "" }}
                        </li>
                    </ol>
                </nav>

                <h1 class="fw-bold mb-2">{{ serie?.title || "" }}</h1>
                <p v-if="serie?.description">{{ serie.description }}</p>
                <div
                    class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
                >
                    <div v-for="(card, idx) in serie?.items" :key="idx" class="col">
                        <Card :card="card" />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import Card from "@/components/Card.vue";
import { useContentStore } from "@/stores/content.ts";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const contentStore = useContentStore();
const { getCompleteCollections } = storeToRefs(contentStore);

const serie = computed(() => {
    return (
        getCompleteCollections.value.find(
            (collection) => collection.id.toString() === route.params.id,
        ) || null
    );
});
</script>
