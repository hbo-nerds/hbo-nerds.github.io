<template>
    <div class="container-fluid py-4">
        <single-card-component :card="card"></single-card-component>
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
