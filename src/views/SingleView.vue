<template>
    <div class="container-fluid py-4">
        <div class="row g-3">
            <div class="col-12 col-lg-10 col-xl-8 offset-lg-1 offset-xl-2">
                <single-card-component :card="card"></single-card-component>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import SingleCardComponent from "@/components/singleCardComponent.vue";
import {onBeforeMount, ref} from "vue";

// router
import {onBeforeRouteUpdate, useRoute} from "vue-router";
const route = useRoute();
const card = ref(null);

// store
const contentStore = useContentStore()

onBeforeMount(() => {
    card.value = contentStore.getSingleCard(route.params.id)
})

onBeforeRouteUpdate((to, from) => {
    card.value = contentStore.getSingleCard(to.params.id)
    window.scrollTo({top: 0, behavior: 'smooth'});
})

</script>
