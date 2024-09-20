<template>
    <main class="pt-3 pb-5">
        <div class="row">
            <div class="col-12">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><router-link :to="{name: 'you'}">You</router-link></li>
                        <li class="breadcrumb-item"><router-link :to="{name: 'playlists'}">Playlists</router-link></li>
                        <li class="breadcrumb-item active" aria-current="page">{{ playlist.title }}</li>
                    </ol>
                </nav>

                <h1 class="fw-bold mb-4">{{ playlist.title }}</h1>
                <select v-model="sort" class="form-select mb-4 w-auto">
                    <option value="newOld">Upload date (new first)</option>
                    <option value="oldNew">Upload date (old first)</option>
                    <option value="shortLong">Duration (shortest first)</option>
                    <option value="longShort">Duration (longest first)</option>
                </select>
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4">
                    <div v-for="(item, idx) in sortedItems" :key="idx" class="col-6">
                        <card-component :card="item"/>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import {computed, onBeforeMount, ref} from "vue";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {useGeneralStore} from "@/stores/general.js";
import CardComponent from "@/components/cardComponent.vue";

const generalStore = useGeneralStore()

const router = useRouter();
const route = useRoute();
const items = ref([]);
const playlist = ref(null);
const sort = ref('newOld')

/**
 * Return sorted list of playlist items.
 * @type {ComputedRef<*>}
 */
const sortedItems = computed(() => {
    return items.value.sort((a, b) => {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);

        if (sort.value === 'oldNew') {
            return dateA - dateB;
        } else if (sort.value === 'newOld') {
            return dateB - dateA;
        } else if (sort.value === 'shortLong') {
            return a.duration - b.duration;
        } else if (sort.value === 'longShort') {
            return b.duration - a.duration;
        }
    })
})

onBeforeMount(() => {
    playlist.value = generalStore.getPlaylist(route.params.title)
    items.value = generalStore.getPlaylistItems(playlist.value['items'])
})

onBeforeRouteUpdate((to, from) => {
    playlist.value = generalStore.getPlaylist(to.params.title)
    window.scrollTo({top: 0, behavior: 'smooth'});
})
</script>
