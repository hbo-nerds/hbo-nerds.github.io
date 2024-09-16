<template>
    <main class="pt-3 pb-5">
        <div class="row">
            <div class="col-12">
                <h1 class="fw-bold mb-4">{{ serie.title }}</h1>
                <p v-if="serie.description">{{ serie.description }}</p>
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4">
                    <div v-for="(card, idx) in items" :key="idx" class="col">
                        <card-component :card="card"/>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {useContentStore} from "@/stores/content.js";
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import CardComponent from "@/components/cardComponent.vue";

const route = useRoute();
const serie = ref(null);
const items = ref(null);

const contentStore = useContentStore()

onBeforeMount(() => {
    serie.value = contentStore.getCollection(route.params.id)
    items.value = contentStore.getSingleCollection(route.params.id)
})

onBeforeRouteUpdate((to, from) => {
    serie.value = contentStore.getCollection(route.params.id)
    items.value = contentStore.getSingleCollection(to.params.id)
    window.scrollTo({top: 0, behavior: 'smooth'});
})
</script>
