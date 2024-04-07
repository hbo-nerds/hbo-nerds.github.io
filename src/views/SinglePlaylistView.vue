<template>
    <div class="container-fluid py-4">
        <div class="row g-3 justify-content-center">
            <!-- main -->
            <div class="col-12 col-lg-10">
                <h3 class="mb-1">{{ playlist.title }}</h3>
                <div class="row g-2">
                    <div class="col-12">{{ items.length}} resultaten</div>
                    <div class="col-6 col-md-4 col-lg-3" v-for="(item, idx) in items" :key="idx">
                        <card-component :card="item"/>
<!--                        <span>{{ item }}</span>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import {useGeneralStore} from "@/stores/general.js";
import CardComponent from "@/components/cardComponent.vue";

const route = useRoute();
const playlist = ref(null);
const items = ref([]);

const generalStore = useGeneralStore()

onBeforeMount(() => {
    playlist.value = generalStore.getPlaylist(route.params.title)
    items.value = generalStore.getPlaylistItems(playlist.value['items'])
})

onBeforeRouteUpdate((to, from) => {
    playlist.value = generalStore.getPlaylist(to.params.title)
    window.scrollTo({top: 0, behavior: 'smooth'});
})
</script>
