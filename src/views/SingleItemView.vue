<template>
    <div class="container-fluid py-4">
        <div class="row gy-3">
            <div class="col-12 col-md-8 mb-md-0">
                <single-card-component :card="card"></single-card-component>
            </div>
            <div class="col-12 col-md-4">
                <div class="card">
                    <div class="card-body">
                        <!-- header -->
                        <header>
                            <h4 class="card-title fw-bold">Serie</h4>
                        </header>
                        <p v-if="collectionName">Bekijk meer uit de '{{ collectionName }}' serie.</p>
                        <p v-else>Maakt deze video deel uit van een serie? <a
                            :href="`https://docs.google.com/forms/d/e/1FAIpQLSeuPAoJu8xsn6JrxrYnRY5v2hw6iSj3eZCXX8QIpFqN6Uy1bA/viewform?usp=pp_url&entry.483165980=${card.id}`"
                            target="_blank">Stuur een beschrijving op!</a></p>
                        <!-- collection -->
                        <template v-if="card.collection">
                            <div class="row series-wrapper">
                                <div class="col-6 col-md-12" v-for="card in collectionItems">
                                    <mini-card-component :card="card"></mini-card-component>
                                </div>
                            </div>
                            <hr>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {computed, onBeforeMount, ref} from "vue";
import SingleCardComponent from "@/components/singleCardComponent.vue";
import MiniCardComponent from "@/components/miniCardComponent.vue";

// router
import {onBeforeRouteUpdate, useRoute} from "vue-router";
const route = useRoute();
const card = ref(null);

// store
const contentStore = useContentStore()

const collectionName = computed(() => {
    return card.value.collection ? contentStore.getCollection(card.value.collection).title : null
})
const collectionItems = computed(() => {
    return contentStore.getSingleCollection(card.value['collection'])
})

onBeforeMount(() => {
    card.value = contentStore.getSingleCard(route.params.id)
})

onBeforeRouteUpdate((to, from) => {
    card.value = contentStore.getSingleCard(to.params.id)
    window.scrollTo({top: 0, behavior: 'smooth'});
})

</script>
