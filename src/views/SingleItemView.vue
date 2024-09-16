<template>
    <div class="container-fluid py-4">
        <div class="row gy-3 justify-content-center">
            <div class="col-12 col-md-8 mb-md-0">
                <single-card-component :card="card"></single-card-component>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {onBeforeMount, ref} from "vue";
import SingleCardComponent from "@/components/singleCardComponent.vue";

import {onBeforeRouteUpdate, useRoute} from "vue-router";
const route = useRoute();
const card = ref(null);

const contentStore = useContentStore()

onBeforeMount(() => {
    card.value = contentStore.getSingleCard(route.params.id)
})

onBeforeRouteUpdate((to, from) => {
    card.value = contentStore.getSingleCard(to.params.id)
    window.scrollTo({top: 0, behavior: 'smooth'});
})

</script>
