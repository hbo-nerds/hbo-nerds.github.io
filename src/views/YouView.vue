<template>
    <!-- main -->
    <main style="padding-top: 42px" class="position-relative">
        <div class="row justify-content-center">
            <div class="col col-xl-10">
                <div class="you-block mb-5">
                    <div class="you-block-title d-flex align-items-center mb-3">
                        <h2 class="fs-5 fw-bold m-0">Geschiedenis</h2>
                        <button type="button" class="ms-auto btn btn-sm btn-dark rounded-pill">Toon alles</button>
                    </div>
                    <div class="you-block-content row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-3xl-5 row-cols-4xl-6 gx-1 gy-3 mb-3">
                        <div class="col" v-for="item in historyContent.slice(0, itemsToShow)">
                            <card-component :card="item"/>
                        </div>
                    </div>
                </div>
                <div class="you-block">
                    <div class="you-block-title d-flex align-items-center mb-3">
                        <h2 class="fs-5 fw-bold m-0">Afspeellijsten</h2>
                        <router-link :to="{name: 'playlists'}" class="ms-auto">
                            <button type="button" class="btn btn-sm btn-dark rounded-pill">Toon alles</button>
                        </router-link>
                    </div>
                    <div class="you-block-content row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-3xl-5 row-cols-4xl-6 gx-1 gy-3 mb-3">
                        <div class="col" v-for="playlist in playlists.slice(0, itemsToShow)">
                            <playlist-component :playlist="playlist"/>
                        </div>
                    </div>
                </div>
                <div class="you-block mb-5">
                    <div class="you-block-title d-flex align-items-center mb-3">
                        <h2 class="fs-5 fw-bold m-0">Liked</h2>
                        <button type="button" class="ms-auto btn btn-sm btn-dark rounded-pill">Toon alles</button>
                    </div>
                    <div class="you-block-content row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-3xl-5 row-cols-4xl-6 gx-1 gy-3 mb-3">
                        <div class="col" v-for="item in likedContent.slice(0, itemsToShow)">
                            <card-component :card="item"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import {storeToRefs} from "pinia";
import {useContentStore} from "@/stores/content.js";
import {defineAsyncComponent, onMounted, ref} from "vue";
import {useGeneralStore} from "@/stores/general.js";
import PlaylistComponent from "@/components/playlistComponent.vue";

const contentStore = useContentStore()
const generalStore = useGeneralStore()
const {likedContent, historyContent} = storeToRefs(contentStore)
const {playlists} = storeToRefs(generalStore)

const itemsToShow = ref(6)

const CardComponent = defineAsyncComponent(() =>
    import("@/components/cardComponent.vue")
)

function setItems() {
    const w = window.innerWidth
    if (w < 576) itemsToShow.value = 2
    else if (w < 768) itemsToShow.value = 3
    else if (w < 992) itemsToShow.value = 4
    else if (w < 1200) itemsToShow.value = 5
    else if (w < 1400) itemsToShow.value = 5
    else if (w < 1750) itemsToShow.value = 5
    else itemsToShow.value = 6
}

onMounted(() => {
    setItems()
    window.addEventListener("resize", (event) => {
        setItems()
    });
})
</script>