<template>
    <div class="container-fluid py-4">
        <div class="row g-3 justify-content-center">
            <!-- main -->
            <div class="col-12 col-lg-10">
                <h3 class="mb-1">{{ serie.title }}</h3>
                <p v-if="serie.description">{{ serie.description }}</p>
                <div class="row g-2">
                    <div class="col-12">{{ items.length}} resultaten</div>
                    <div class="col-6 col-md-4 col-lg-3" v-for="(card, idx) in items" :key="idx">
                        <card-component :card="card"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
